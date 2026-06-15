import { hyperConfig } from './hyperconfig.service';

interface RuleCondition {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: unknown;
}

interface RuleAction {
  type: 'show_badge' | 'show_message' | 'apply_discount' | 'show_banner' | 'hide_element';
  payload: Record<string, unknown>;
}

interface BusinessRule {
  id: string;
  name: string;
  condition: RuleCondition | RuleCondition[];
  action: RuleAction;
  isActive: boolean;
  priority: number;
}

export class BusinessRulesEngine {
  evaluate(rules: BusinessRule[], context: Record<string, unknown>): RuleAction[] {
    const matchedActions: RuleAction[] = [];

    const sortedRules = [...rules]
      .filter((r) => r.isActive)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      if (this.evaluateCondition(rule.condition, context)) {
        matchedActions.push(rule.action);
      }
    }

    return matchedActions;
  }

  evaluateProductRules(
    product: Record<string, unknown>,
    user?: Record<string, unknown>
  ): RuleAction[] {
    const rules = (hyperConfig as unknown as { _rules?: BusinessRule[] })._rules || [];
    const context = {
      stock: product.stock,
      price: product.price,
      comparePrice: product.comparePrice,
      isFeatured: product.isFeatured,
      userRole: user?.role,
      isFirstPurchase: user?.isFirstPurchase,
      discountLevel: user?.discountLevel,
    };

    return this.evaluate(rules as BusinessRule[], context);
  }

  private evaluateCondition(
    condition: RuleCondition | RuleCondition[],
    context: Record<string, unknown>
  ): boolean {
    if (Array.isArray(condition)) {
      return condition.every((c) => this.evaluateSingle(c, context));
    }
    return this.evaluateSingle(condition, context);
  }

  private evaluateSingle(condition: RuleCondition, context: Record<string, unknown>): boolean {
    const fieldValue = context[condition.field];
    const { operator, value } = condition;

    switch (operator) {
      case 'eq':
        return fieldValue === value;
      case 'neq':
        return fieldValue !== value;
      case 'gt':
        return Number(fieldValue) > Number(value);
      case 'gte':
        return Number(fieldValue) >= Number(value);
      case 'lt':
        return Number(fieldValue) < Number(value);
      case 'lte':
        return Number(fieldValue) <= Number(value);
      case 'in':
        return Array.isArray(value) && value.includes(fieldValue);
      case 'contains':
        return String(fieldValue).includes(String(value));
      default:
        return false;
    }
  }
}

export const businessRulesEngine = new BusinessRulesEngine();
