import { ConfigCategory, ConfigLayer, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { cacheDel, cacheGet, cacheSet } from '../lib/redis';

const CONFIG_CACHE_PREFIX = 'hyperconfig:';
const CONFIG_CACHE_TTL = 60;

/** SYSTEM keys safe to expose on the storefront */
const PUBLIC_SYSTEM_KEYS = new Set(['site_name', 'currency']);

/** SYSTEM keys that must never be exposed publicly */
export const SECRET_CONFIG_KEYS = new Set([
  'openai_api_key',
  'zarinpal_merchant',
  'payment_gateways',
]);

export interface ConfigValue {
  key: string;
  value: unknown;
  defaultValue: unknown;
  category: ConfigCategory;
  layer: ConfigLayer;
  isActive: boolean;
  conditions?: unknown;
  metadata?: unknown;
}

export class HyperConfigService {
  private static instance: HyperConfigService;

  static getInstance(): HyperConfigService {
    if (!HyperConfigService.instance) {
      HyperConfigService.instance = new HyperConfigService();
    }
    return HyperConfigService.instance;
  }

  async get(key: string, sandboxId?: string): Promise<unknown> {
    const cacheKey = `${CONFIG_CACHE_PREFIX}${sandboxId || 'live'}:${key}`;
    const cached = await cacheGet<unknown>(cacheKey);
    if (cached !== null) return cached;

    if (sandboxId) {
      const override = await prisma.sandboxOverride.findFirst({
        where: {
          sandboxSessionId: sandboxId,
          setting: { key },
        },
        include: { setting: true },
      });
      if (override) {
        await cacheSet(cacheKey, override.value, CONFIG_CACHE_TTL);
        return override.value;
      }
    }

    const setting = await prisma.setting.findUnique({ where: { key } });
    if (!setting || !setting.isActive) return null;

    await cacheSet(cacheKey, setting.value, CONFIG_CACHE_TTL);
    return setting.value;
  }

  async getAll(options?: {
    category?: ConfigCategory;
    layer?: ConfigLayer;
    sandboxId?: string;
  }): Promise<ConfigValue[]> {
    const cacheKey = `${CONFIG_CACHE_PREFIX}${options?.sandboxId || 'live'}:all:${options?.category || 'all'}:${options?.layer || 'all'}`;
    const cached = await cacheGet<ConfigValue[]>(cacheKey);
    if (cached) return cached;

    const settings = await prisma.setting.findMany({
      where: {
        ...(options?.category && { category: options.category }),
        ...(options?.layer && { layer: options.layer }),
        isActive: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { key: 'asc' }],
    });

    let result: ConfigValue[] = settings.map((s) => ({
      key: s.key,
      value: s.value,
      defaultValue: s.defaultValue,
      category: s.category,
      layer: s.layer,
      isActive: s.isActive,
      conditions: s.conditions,
      metadata: s.metadata,
    }));

    if (options?.sandboxId) {
      const overrides = await prisma.sandboxOverride.findMany({
        where: { sandboxSessionId: options.sandboxId },
        include: { setting: true },
      });

      const overrideMap = new Map(overrides.map((o) => [o.setting.key, o.value]));
      result = result.map((r) => ({
        ...r,
        value: overrideMap.has(r.key) ? overrideMap.get(r.key) : r.value,
      }));
    }

    await cacheSet(cacheKey, result, CONFIG_CACHE_TTL);
    return result;
  }

  async getPublicConfig(sandboxId?: string): Promise<Record<string, unknown>> {
    const cacheKey = `${CONFIG_CACHE_PREFIX}${sandboxId || 'live'}:public`;
    const cached = await cacheGet<Record<string, unknown>>(cacheKey);
    if (cached) return cached;

    const settings = await this.getAll({ sandboxId });
    const config: Record<string, unknown> = {};

    for (const setting of settings) {
      if (!setting.isActive) continue;

      if (setting.layer !== ConfigLayer.SYSTEM) {
        config[setting.key] = setting.value;
        continue;
      }

      if (PUBLIC_SYSTEM_KEYS.has(setting.key)) {
        config[setting.key] = setting.value;
      }
    }

    const modules = await prisma.module.findMany({
      where: { isActive: true },
      include: {
        components: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    config._modules = modules;

    const navigation = await prisma.navigationItem.findMany({
      where: { isActive: true, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    config._navigation = navigation;

    const routes = await prisma.routeConfig.findMany({ where: { isActive: true } });
    config._routes = routes;

    const businessRules = await prisma.businessRule.findMany({
      where: { isActive: true },
      orderBy: { priority: 'desc' },
    });
    config._businessRules = businessRules;

    const productFields = await prisma.productFieldDefinition.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    config._productFields = productFields;

    await cacheSet(cacheKey, config, CONFIG_CACHE_TTL);
    return config;
  }

  async set(
    key: string,
    value: unknown,
    options?: { sandboxId?: string; userId?: string }
  ): Promise<ConfigValue> {
    const setting = await prisma.setting.findUnique({ where: { key } });
    if (!setting) throw new Error(`Setting not found: ${key}`);
    if (!setting.editableByAdmin) throw new Error(`Setting is not editable: ${key}`);

    if (options?.sandboxId) {
      await prisma.sandboxOverride.upsert({
        where: {
          sandboxSessionId_settingId: {
            sandboxSessionId: options.sandboxId,
            settingId: setting.id,
          },
        },
        create: {
          sandboxSessionId: options.sandboxId,
          settingId: setting.id,
          value: value as Prisma.InputJsonValue,
        },
        update: { value: value as Prisma.InputJsonValue },
      });
    } else {
      await prisma.setting.update({
        where: { key },
        data: { value: value as Prisma.InputJsonValue },
      });
    }

    await this.invalidateCache(key, options?.sandboxId);
    return {
      key: setting.key,
      value,
      defaultValue: setting.defaultValue,
      category: setting.category,
      layer: setting.layer,
      isActive: setting.isActive,
    };
  }

  async create(data: {
    key: string;
    value: unknown;
    defaultValue: unknown;
    category: ConfigCategory;
    layer?: ConfigLayer;
    label?: string;
    description?: string;
    editableByAdmin?: boolean;
    deletable?: boolean;
    conditions?: unknown;
    metadata?: unknown;
  }) {
    const setting = await prisma.setting.create({
      data: {
        key: data.key,
        value: data.value as Prisma.InputJsonValue,
        defaultValue: data.defaultValue as Prisma.InputJsonValue,
        category: data.category,
        layer: data.layer || ConfigLayer.COMPONENT,
        label: data.label,
        description: data.description,
        editableByAdmin: data.editableByAdmin ?? true,
        deletable: data.deletable ?? true,
        conditions: data.conditions as Prisma.InputJsonValue,
        metadata: data.metadata as Prisma.InputJsonValue,
      },
    });

    await this.invalidateCache(data.key);
    return setting;
  }

  async delete(key: string): Promise<void> {
    const setting = await prisma.setting.findUnique({ where: { key } });
    if (!setting) throw new Error(`Setting not found: ${key}`);
    if (!setting.deletable) throw new Error(`Setting cannot be deleted: ${key}`);

    await prisma.setting.delete({ where: { key } });
    await this.invalidateCache(key);
  }

  async resetToDefault(key: string, sandboxId?: string): Promise<ConfigValue> {
    const setting = await prisma.setting.findUnique({ where: { key } });
    if (!setting) throw new Error(`Setting not found: ${key}`);

    if (sandboxId) {
      await prisma.sandboxOverride.deleteMany({
        where: {
          sandboxSessionId: sandboxId,
          settingId: setting.id,
        },
      });
    } else {
      await prisma.setting.update({
        where: { key },
        data: { value: setting.defaultValue as Prisma.InputJsonValue },
      });
    }

    await this.invalidateCache(key, sandboxId);
    return {
      key: setting.key,
      value: setting.defaultValue,
      defaultValue: setting.defaultValue,
      category: setting.category,
      layer: setting.layer,
      isActive: setting.isActive,
    };
  }

  async toggleActive(key: string): Promise<ConfigValue> {
    const setting = await prisma.setting.findUnique({ where: { key } });
    if (!setting) throw new Error(`Setting not found: ${key}`);

    const updated = await prisma.setting.update({
      where: { key },
      data: { isActive: !setting.isActive },
    });

    await this.invalidateCache(key);
    return {
      key: updated.key,
      value: updated.value,
      defaultValue: updated.defaultValue,
      category: updated.category,
      layer: updated.layer,
      isActive: updated.isActive,
    };
  }

  // Sandbox operations
  async createSandbox(name: string, createdBy: string) {
    return prisma.sandboxSession.create({
      data: {
        name,
        createdBy,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  async applySandbox(sandboxId: string): Promise<number> {
    const overrides = await prisma.sandboxOverride.findMany({
      where: { sandboxSessionId: sandboxId },
      include: { setting: true },
    });

    for (const override of overrides) {
      await prisma.setting.update({
        where: { id: override.settingId },
        data: { value: override.value as Prisma.InputJsonValue },
      });
    }

    await prisma.sandboxSession.update({
      where: { id: sandboxId },
      data: { isActive: false },
    });

    await cacheDel(`${CONFIG_CACHE_PREFIX}*`);
    return overrides.length;
  }

  async discardSandbox(sandboxId: string): Promise<void> {
    await prisma.sandboxSession.delete({ where: { id: sandboxId } });
    await cacheDel(`${CONFIG_CACHE_PREFIX}${sandboxId}*`);
  }

  private async invalidateCache(key: string, sandboxId?: string): Promise<void> {
    await cacheDel(`${CONFIG_CACHE_PREFIX}*${key}*`);
    await cacheDel(`${CONFIG_CACHE_PREFIX}${sandboxId || 'live'}*`);
    await cacheDel(`${CONFIG_CACHE_PREFIX}*public*`);
    await cacheDel(`${CONFIG_CACHE_PREFIX}*all*`);
  }
}

export const hyperConfig = HyperConfigService.getInstance();
