import { hyperConfig } from './hyperconfig.service';

interface ZarinpalRequestResponse {
  data?: {
    code: number;
    message: string;
    authority: string;
    fee_type: string;
    fee: number;
  };
  errors?: Array<{ code: number; message: string }>;
}

interface ZarinpalVerifyResponse {
  data?: {
    code: number;
    message: string;
    ref_id: number;
    card_pan: string;
    fee_type: string;
    fee: number;
  };
  errors?: Array<{ code: number; message: string }>;
}

export class ZarinpalService {
  private async getConfig() {
    const merchant = await hyperConfig.get('zarinpal_merchant');
    const gateways = (await hyperConfig.get('payment_gateways')) as Record<string, boolean> | null;
    const sandbox = await hyperConfig.get('zarinpal_sandbox');

    const isEnabled = gateways?.zarinpal === true;
    const merchantId = typeof merchant === 'string' ? merchant : '';
    const useSandbox = sandbox === true || sandbox === 'true' || !merchantId;

    const baseUrl = useSandbox
      ? 'https://sandbox.zarinpal.com/pg/v4/payment'
      : 'https://payment.zarinpal.com/pg/v4/payment';

    const startPayUrl = useSandbox
      ? 'https://sandbox.zarinpal.com/pg/StartPay'
      : 'https://www.zarinpal.com/pg/StartPay';

    return { isEnabled, merchantId, baseUrl, startPayUrl, useSandbox };
  }

  async isEnabled(): Promise<boolean> {
    const { isEnabled, merchantId, useSandbox } = await this.getConfig();
    return isEnabled && (useSandbox || merchantId.length > 0);
  }

  async requestPayment(params: {
    amount: number;
    description: string;
    callbackUrl: string;
    email?: string;
    mobile?: string;
  }): Promise<{ authority: string; paymentUrl: string }> {
    const { merchantId, baseUrl, startPayUrl, useSandbox } = await this.getConfig();

    const merchant = useSandbox ? '00000000-0000-0000-0000-000000000000' : merchantId;
    if (!merchant) throw new Error('Zarinpal merchant ID not configured');

    const response = await fetch(`${baseUrl}/request.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        merchant_id: merchant,
        amount: params.amount,
        description: params.description,
        callback_url: params.callbackUrl,
        metadata: {
          email: params.email,
          mobile: params.mobile,
        },
      }),
    });

    const data = (await response.json()) as ZarinpalRequestResponse;

    if (data.data?.code === 100 && data.data.authority) {
      return {
        authority: data.data.authority,
        paymentUrl: `${startPayUrl}/${data.data.authority}`,
      };
    }

    const errorMsg = data.errors?.[0]?.message || data.data?.message || 'Payment request failed';
    throw new Error(errorMsg);
  }

  async verifyPayment(authority: string, amount: number): Promise<{ refId: number; cardPan: string }> {
    const { merchantId, baseUrl, useSandbox } = await this.getConfig();
    const merchant = useSandbox ? '00000000-0000-0000-0000-000000000000' : merchantId;

    const response = await fetch(`${baseUrl}/verify.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        merchant_id: merchant,
        amount,
        authority,
      }),
    });

    const data = (await response.json()) as ZarinpalVerifyResponse;

    if (data.data?.code === 100 || data.data?.code === 101) {
      return {
        refId: data.data.ref_id,
        cardPan: data.data.card_pan,
      };
    }

    const errorMsg = data.errors?.[0]?.message || data.data?.message || 'Payment verification failed';
    throw new Error(errorMsg);
  }
}

export const zarinpalService = new ZarinpalService();
