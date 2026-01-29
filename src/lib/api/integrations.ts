/**
 * Integrations API Client
 * Webhooks and Third-Party Integrations Service
 * 
 * Backend: integrations-service (Port 3014)
 * 
 * Supports:
 * - Custom webhooks
 * - Zapier
 * - Slack
 * - Google Sheets
 * - HubSpot
 * - Salesforce
 * - Mailchimp
 * - Stripe
 * - PayPal
 * - Shopify
 * - WooCommerce
 * - SendGrid
 */

import { api } from './client';

// ============================================
// TYPES
// ============================================

export type WebhookTrigger = 
  | 'qr.scanned'
  | 'qr.created'
  | 'qr.deleted'
  | 'microsite.published'
  | 'lead.captured'
  | 'experiment.completed'
  | 'goal.reached';

export type WebhookMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Webhook {
  id: string;
  userId: string;
  name: string;
  url: string;
  method: WebhookMethod;
  triggers: WebhookTrigger[];
  filters?: Record<string, unknown>;
  headers?: Record<string, string>;
  bodyTemplate?: string;
  secret?: string;
  retryEnabled: boolean;
  maxRetries: number;
  retryDelay: number;
  isActive: boolean;
  lastTriggeredAt?: string;
  successCount: number;
  failureCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  trigger: string;
  requestUrl: string;
  requestMethod: string;
  requestHeaders: Record<string, string>;
  requestBody: string;
  responseStatus: number;
  responseBody: string;
  duration: number;
  success: boolean;
  error?: string;
  retryCount: number;
  createdAt: string;
}

export interface CreateWebhookInput {
  name: string;
  url: string;
  method?: WebhookMethod;
  triggers: WebhookTrigger[];
  filters?: Record<string, unknown>;
  headers?: Record<string, string>;
  bodyTemplate?: string;
  secret?: string;
  retryEnabled?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export type IntegrationType = 
  | 'zapier'
  | 'slack'
  | 'google_sheets'
  | 'hubspot'
  | 'salesforce'
  | 'mailchimp'
  | 'stripe'
  | 'paypal'
  | 'shopify'
  | 'woocommerce'
  | 'sendgrid';

export interface Integration {
  id: string;
  userId: string;
  type: IntegrationType;
  name: string;
  isConnected: boolean;
  config: Record<string, unknown>;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OAuthConnectResponse {
  authUrl: string;
  state: string;
}

// ============================================
// WEBHOOK API FUNCTIONS
// ============================================

export const integrationsApi = {
  // ============================================
  // WEBHOOKS
  // ============================================

  /**
   * List all webhooks
   */
  listWebhooks: async (): Promise<{ webhooks: Webhook[] }> => {
    return api.get('/integrations/webhooks');
  },

  /**
   * Get a single webhook
   */
  getWebhook: async (webhookId: string): Promise<Webhook> => {
    return api.get(`/integrations/webhooks/${webhookId}`);
  },

  /**
   * Create a new webhook
   */
  createWebhook: async (data: CreateWebhookInput): Promise<Webhook> => {
    return api.post('/integrations/webhooks', data);
  },

  /**
   * Update a webhook
   */
  updateWebhook: async (webhookId: string, data: Partial<CreateWebhookInput>): Promise<Webhook> => {
    return api.patch(`/integrations/webhooks/${webhookId}`, data);
  },

  /**
   * Delete a webhook
   */
  deleteWebhook: async (webhookId: string): Promise<void> => {
    return api.delete(`/integrations/webhooks/${webhookId}`);
  },

  /**
   * Test a webhook (sends test payload)
   */
  testWebhook: async (webhookId: string): Promise<{ success: boolean; response: WebhookLog }> => {
    return api.post(`/integrations/webhooks/${webhookId}/test`);
  },

  /**
   * Get webhook logs
   */
  getWebhookLogs: async (webhookId: string, params?: {
    page?: number;
    limit?: number;
    success?: boolean;
  }): Promise<{ logs: WebhookLog[]; total: number }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.success !== undefined) searchParams.append('success', params.success.toString());
    
    const query = searchParams.toString();
    return api.get(`/integrations/webhooks/${webhookId}/logs${query ? `?${query}` : ''}`);
  },

  // ============================================
  // INTEGRATIONS
  // ============================================

  /**
   * List all integrations
   */
  listIntegrations: async (): Promise<{ integrations: Integration[] }> => {
    return api.get('/integrations');
  },

  /**
   * Get integration status
   */
  getIntegration: async (type: IntegrationType): Promise<Integration | null> => {
    return api.get(`/integrations/${type}`);
  },

  /**
   * Disconnect an integration
   */
  disconnectIntegration: async (type: IntegrationType): Promise<void> => {
    return api.delete(`/integrations/${type}`);
  },

  // ============================================
  // OAUTH INTEGRATIONS
  // ============================================

  /**
   * Start Zapier OAuth flow
   */
  connectZapier: async (): Promise<OAuthConnectResponse> => {
    return api.get('/integrations/zapier/auth');
  },

  /**
   * Start Slack OAuth flow
   */
  connectSlack: async (config?: { channelId?: string }): Promise<OAuthConnectResponse> => {
    return api.post('/integrations/slack/connect', config);
  },

  /**
   * Start Google Sheets OAuth flow
   */
  connectGoogleSheets: async (): Promise<OAuthConnectResponse> => {
    return api.get('/integrations/google-sheets/auth');
  },

  /**
   * Start HubSpot OAuth flow
   */
  connectHubSpot: async (): Promise<OAuthConnectResponse> => {
    return api.get('/integrations/hubspot/auth');
  },

  /**
   * Start Salesforce OAuth flow
   */
  connectSalesforce: async (): Promise<OAuthConnectResponse> => {
    return api.get('/integrations/salesforce/auth');
  },

  /**
   * Start Mailchimp OAuth flow
   */
  connectMailchimp: async (): Promise<OAuthConnectResponse> => {
    return api.get('/integrations/mailchimp/auth');
  },

  /**
   * Start Shopify OAuth flow
   */
  connectShopify: async (shopDomain: string): Promise<OAuthConnectResponse> => {
    return api.post('/integrations/shopify/auth', { shopDomain });
  },

  // ============================================
  // PAYMENT INTEGRATIONS
  // ============================================

  /**
   * Connect Stripe account
   */
  connectStripe: async (): Promise<OAuthConnectResponse> => {
    return api.get('/stripe/connect');
  },

  /**
   * Connect PayPal account
   */
  connectPayPal: async (config: {
    clientId: string;
    clientSecret: string;
    sandbox?: boolean;
  }): Promise<{ success: boolean }> => {
    return api.post('/integrations/paypal/connect', config);
  },

  // ============================================
  // E-COMMERCE INTEGRATIONS
  // ============================================

  /**
   * Connect WooCommerce store
   */
  connectWooCommerce: async (config: {
    storeUrl: string;
    consumerKey: string;
    consumerSecret: string;
  }): Promise<{ success: boolean }> => {
    return api.post('/integrations/woocommerce/connect', config);
  },

  // ============================================
  // EMAIL INTEGRATIONS
  // ============================================

  /**
   * Connect SendGrid
   */
  connectSendGrid: async (apiKey: string): Promise<{ success: boolean }> => {
    return api.post('/integrations/sendgrid/connect', { apiKey });
  },

  /**
   * Send test email via SendGrid
   */
  sendTestEmail: async (to: string): Promise<{ success: boolean }> => {
    return api.post('/integrations/sendgrid/test', { to });
  },

  // ============================================
  // ZAPIER SPECIFIC
  // ============================================

  /**
   * Get Zapier triggers for this account
   */
  getZapierTriggers: async (): Promise<{ triggers: Array<{ id: string; name: string; description: string }> }> => {
    return api.get('/integrations/zapier/triggers');
  },

  /**
   * List active Zaps
   */
  listZaps: async (): Promise<{ zaps: Array<{ id: string; title: string; status: string }> }> => {
    return api.get('/integrations/zapier/zaps');
  },

  // ============================================
  // STRIPE CHECKOUT (For Payment Blocks)
  // ============================================

  /**
   * Create a Stripe checkout session for payment blocks
   * This allows microsites to accept payments without full Stripe Connect
   */
  createStripeCheckout: async (data: {
    amount?: number;
    currency?: string;
    description?: string;
    successUrl: string;
    cancelUrl: string;
    micrositeId?: string;
    blockId?: string;
    customerEmail?: string;
    mode?: 'payment' | 'subscription';
    // Multi-product support
    lineItems?: Array<{
      name: string;
      description?: string;
      price: number;
      quantity: number;
      currency?: string;
      image?: string;
      imageUrl?: string;
      stripePriceId?: string;
      metadata?: Record<string, unknown>;
    }>;
    metadata?: Record<string, string>;
  }): Promise<{ sessionId: string; checkoutUrl: string; url?: string }> => {
    // Transform lineItems to items format expected by backend
    const payload: Record<string, unknown> = {
      items: data.lineItems || [],
      metadata: {
        ...data.metadata,
        creatorId: data.micrositeId || data.metadata?.creatorId || 'demo-creator',
        micrositeId: data.micrositeId,
      },
      uiMode: 'hosted', // ShopBlock uses hosted (redirect) checkout
      successUrl: data.successUrl,
      cancelUrl: data.cancelUrl,
    };

    const response = await api.post('/stripe/checkout/create', payload) as { sessionId: string; url: string };
    
    // Backend returns { sessionId, url } for hosted mode
    return {
      sessionId: response.sessionId,
      checkoutUrl: response.url || '',
      url: response.url,
    };
  },

  /**
   * Get Stripe connected account status
   */
  getStripeStatus: async (): Promise<{
    isConnected: boolean;
    chargesEnabled?: boolean;
    payoutsEnabled?: boolean;
    accountId?: string;
  }> => {
    return api.get('/stripe/status');
  },
};
