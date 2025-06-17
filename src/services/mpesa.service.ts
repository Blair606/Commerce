import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';

interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  shortcode: string;
  env: 'sandbox' | 'production';
}

interface MpesaPaymentRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export class MpesaService {
  private static instance: MpesaService;
  private config: MpesaConfig;
  private accessToken: string = '';
  private tokenExpiry: Date | null = null;

  private constructor(config: MpesaConfig) {
    this.config = config;
  }

  public static getInstance(config: MpesaConfig): MpesaService {
    if (!MpesaService.instance) {
      MpesaService.instance = new MpesaService(config);
    }
    return MpesaService.instance;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    try {
      const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');
      const response = await axios.get(
        `${this.config.env === 'sandbox' ? 'https://sandbox.safaricom.co.ke' : 'https://api.safaricom.co.ke'}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );

      if (!response.data.access_token) {
        throw new Error('No access token received from M-Pesa API');
      }

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000));
      return this.accessToken;
    } catch (error) {
      console.error('Error getting M-Pesa access token:', error);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  public async initiatePayment(request: MpesaPaymentRequest): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = Buffer.from(
        `${this.config.shortcode}${this.config.passkey}${timestamp}`
      ).toString('base64');

      const response = await axios.post(
        `${this.config.env === 'sandbox' ? 'https://sandbox.safaricom.co.ke' : 'https://api.safaricom.co.ke'}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.config.shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: request.amount,
          PartyA: request.phoneNumber,
          PartyB: this.config.shortcode,
          PhoneNumber: request.phoneNumber,
          CallBackURL: `${API_ENDPOINTS.MPESA.CALLBACK}`,
          AccountReference: request.accountReference,
          TransactionDesc: request.transactionDesc
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error initiating M-Pesa payment:', error);
      throw new Error('Failed to initiate M-Pesa payment');
    }
  }

  public async confirmPayment(CheckoutRequestID: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      const response = await axios.post(
        `${this.config.env === 'sandbox' ? 'https://sandbox.safaricom.co.ke' : 'https://api.safaricom.co.ke'}/mpesa/stkpushquery/v1/query`,
        {
          BusinessShortCode: this.config.shortcode,
          Password: this.config.passkey,
          Timestamp: new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3),
          CheckoutRequestID
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error confirming M-Pesa payment:', error);
      throw new Error('Failed to confirm M-Pesa payment');
    }
  }
} 