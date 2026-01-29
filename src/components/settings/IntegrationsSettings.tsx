/**
 * Integrations Settings Component
 * Manage webhooks and third-party integrations
 */

import { useState, useEffect } from 'react';
import { 
  Webhook, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Play,
  Loader2,
  Link2,
  ExternalLink,
  CreditCard,
  Info,
  Key,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { integrationsApi } from '../../lib/api';
import type { Webhook as WebhookType, Integration, IntegrationType, WebhookTrigger } from '../../lib/api';

// Integration logos/icons
const integrationLogos: Record<IntegrationType, { bg: string; text: string }> = {
  zapier: { bg: 'bg-orange-100', text: '⚡' },
  slack: { bg: 'bg-purple-100', text: '💬' },
  hubspot: { bg: 'bg-orange-100', text: '🟠' },
  salesforce: { bg: 'bg-blue-100', text: '☁️' },
  google_sheets: { bg: 'bg-green-100', text: '📊' },
  mailchimp: { bg: 'bg-yellow-100', text: '🐵' },
  stripe: { bg: 'bg-purple-100', text: '💳' },
  paypal: { bg: 'bg-blue-100', text: '🅿️' },
  shopify: { bg: 'bg-green-100', text: '🛒' },
  woocommerce: { bg: 'bg-purple-100', text: '🛍️' },
  sendgrid: { bg: 'bg-blue-100', text: '📧' },
};

const availableIntegrations: Array<{
  type: IntegrationType;
  name: string;
  description: string;
  category: 'automation' | 'crm' | 'email' | 'payment' | 'ecommerce';
}> = [
  { type: 'zapier', name: 'Zapier', description: 'Connect to 5000+ apps', category: 'automation' },
  { type: 'slack', name: 'Slack', description: 'Send notifications to channels', category: 'automation' },
  { type: 'hubspot', name: 'HubSpot', description: 'Sync contacts and leads', category: 'crm' },
  { type: 'salesforce', name: 'Salesforce', description: 'Enterprise CRM integration', category: 'crm' },
  { type: 'google_sheets', name: 'Google Sheets', description: 'Export data to spreadsheets', category: 'automation' },
  { type: 'mailchimp', name: 'Mailchimp', description: 'Add subscribers to lists', category: 'email' },
  { type: 'sendgrid', name: 'SendGrid', description: 'Email delivery service', category: 'email' },
  { type: 'stripe', name: 'Stripe', description: 'Accept payments', category: 'payment' },
  { type: 'paypal', name: 'PayPal', description: 'PayPal checkout', category: 'payment' },
  { type: 'shopify', name: 'Shopify', description: 'E-commerce integration', category: 'ecommerce' },
  { type: 'woocommerce', name: 'WooCommerce', description: 'WordPress e-commerce', category: 'ecommerce' },
];

const webhookTriggers: WebhookTrigger[] = [
  'qr.scanned',
  'qr.created',
  'lead.captured',
  'microsite.published',
  'experiment.completed',
  'goal.reached',
];

export function IntegrationsSettings() {
  const [webhooks, setWebhooks] = useState<WebhookType[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'integrations' | 'webhooks'>('integrations');
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [newWebhook, setNewWebhook] = useState<{
    name: string;
    url: string;
    triggers: WebhookTrigger[];
  }>({ name: '', url: '', triggers: ['qr.scanned', 'lead.captured'] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);
  const [connectingIntegration, setConnectingIntegration] = useState<IntegrationType | null>(null);
  const [showStripeInfo, setShowStripeInfo] = useState(false);

  // Check if Stripe is connected
  const stripeIntegration = integrations.find(i => i.type === 'stripe');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [webhooksRes, integrationsRes] = await Promise.all([
        integrationsApi.listWebhooks(),
        integrationsApi.listIntegrations(),
      ]);
      setWebhooks(webhooksRes.webhooks);
      setIntegrations(integrationsRes.integrations);
    } catch (error) {
      console.error('Failed to load integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhook.name || !newWebhook.url) return;
    
    try {
      setIsSubmitting(true);
      const webhook = await integrationsApi.createWebhook({
        name: newWebhook.name,
        url: newWebhook.url,
        triggers: newWebhook.triggers,
      });
      setWebhooks(prev => [...prev, webhook]);
      setNewWebhook({ name: '', url: '', triggers: ['qr.scanned', 'lead.captured'] });
      setShowAddWebhook(false);
    } catch (error) {
      console.error('Failed to create webhook:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    try {
      setTestingWebhook(webhookId);
      await integrationsApi.testWebhook(webhookId);
    } catch (error) {
      console.error('Failed to test webhook:', error);
    } finally {
      setTestingWebhook(null);
    }
  };

  const handleDeleteWebhook = async (webhookId: string) => {
    if (!confirm('Are you sure you want to delete this webhook?')) return;
    
    try {
      await integrationsApi.deleteWebhook(webhookId);
      setWebhooks(prev => prev.filter(w => w.id !== webhookId));
    } catch (error) {
      console.error('Failed to delete webhook:', error);
    }
  };

  const handleToggleWebhook = async (webhook: WebhookType) => {
    try {
      // Toggle locally for immediate feedback
      setWebhooks(prev => prev.map(w => 
        w.id === webhook.id ? { ...w, isActive: !w.isActive } : w
      ));
      // In a full implementation, you'd call an API to persist this
      await integrationsApi.updateWebhook(webhook.id, {});
    } catch (error) {
      console.error('Failed to toggle webhook:', error);
      // Revert on error
      setWebhooks(prev => prev.map(w => 
        w.id === webhook.id ? { ...w, isActive: webhook.isActive } : w
      ));
    }
  };

  const handleConnectIntegration = async (type: IntegrationType) => {
    setConnectingIntegration(type);
    
    try {
      let authUrl: string | undefined;
      
      switch (type) {
        case 'zapier': {
          const res = await integrationsApi.connectZapier();
          authUrl = res.authUrl;
          break;
        }
        case 'slack': {
          const res = await integrationsApi.connectSlack();
          authUrl = res.authUrl;
          break;
        }
        case 'google_sheets': {
          const res = await integrationsApi.connectGoogleSheets();
          authUrl = res.authUrl;
          break;
        }
        case 'hubspot': {
          const res = await integrationsApi.connectHubSpot();
          authUrl = res.authUrl;
          break;
        }
        case 'salesforce': {
          const res = await integrationsApi.connectSalesforce();
          authUrl = res.authUrl;
          break;
        }
        case 'mailchimp': {
          const res = await integrationsApi.connectMailchimp();
          authUrl = res.authUrl;
          break;
        }
        case 'stripe': {
          const res = await integrationsApi.connectStripe();
          authUrl = res.authUrl;
          break;
        }
        default:
          // Show coming soon message for integrations without OAuth
          alert(`${type.charAt(0).toUpperCase() + type.slice(1)} integration coming soon! We're working on connecting with more platforms.`);
          setConnectingIntegration(null);
          return;
      }
      
      if (authUrl) {
        // Successfully got auth URL, redirect to OAuth flow
        console.log(`Redirecting to ${type} OAuth:`, authUrl);
        window.location.href = authUrl;
      } else {
        console.warn(`No authUrl returned for ${type}`);
        alert(`Integration with ${type} is not yet fully configured. The OAuth credentials may be missing. Please check:\n\n1. Integration service is running (port 3014)\n2. Environment variables are set for ${type.toUpperCase()}\n3. Backend logs for more details`);
      }
    } catch (err) {
      console.error('Failed to connect integration:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      // Check if it's a network error
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('Network')) {
        alert(`Unable to connect to integration service.\n\nPlease ensure:\n1. Integration service is running (port 3014)\n2. Nginx gateway is running (port 3000)\n3. Check docker-compose services\n\nTechnical error: ${errorMessage}`);
      } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        alert(`Authentication required.\n\nPlease sign in again and try reconnecting ${type}.`);
      } else {
        alert(`Unable to connect ${type}.\n\nError: ${errorMessage}\n\nPlease check:\n1. Integration service logs\n2. Environment configuration for ${type.toUpperCase()}\n3. OAuth credentials are properly set`);
      }
    } finally {
      setConnectingIntegration(null);
    }
  };

  const handleDisconnectIntegration = async (integration: Integration) => {
    if (!confirm('Are you sure you want to disconnect this integration?')) return;
    
    try {
      await integrationsApi.disconnectIntegration(integration.type);
      setIntegrations(prev => prev.filter(i => i.id !== integration.id));
    } catch (error) {
      console.error('Failed to disconnect integration:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'integrations'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Link2 className="w-4 h-4" />
              Integrations ({integrations.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'webhooks'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Webhook className="w-4 h-4" />
              Webhooks ({webhooks.length})
            </div>
          </button>
        </div>

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="p-6">
            {/* Connected Integrations */}
            {integrations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Connected
                </h3>
                <div className="grid gap-4">
                  {integrations.map((integration) => (
                    <div 
                      key={integration.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${integrationLogos[integration.type].bg} flex items-center justify-center text-2xl`}>
                          {integrationLogos[integration.type].text}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{integration.name}</h4>
                          <p className="text-sm text-gray-500">
                            Connected {new Date(integration.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <Check className="w-3 h-3" /> Connected
                        </span>
                        <button
                          onClick={() => handleDisconnectIntegration(integration)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Disconnect"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Integrations */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                Available Integrations
              </h3>
              
              {/* Automation */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-gray-400 mb-3">Automation</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {availableIntegrations
                    .filter(i => i.category === 'automation')
                    .map((integration) => {
                      const isConnected = integrations.some(i => i.type === integration.type);
                      const isConnecting = connectingIntegration === integration.type;
                      return (
                        <div 
                          key={integration.type}
                          className="flex items-center justify-between p-4 border rounded-lg hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${integrationLogos[integration.type].bg} flex items-center justify-center text-xl`}>
                              {integrationLogos[integration.type].text}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{integration.name}</h4>
                              <p className="text-xs text-gray-500">{integration.description}</p>
                            </div>
                          </div>
                          {!isConnected && (
                            <button
                              onClick={() => handleConnectIntegration(integration.type)}
                              disabled={isConnecting}
                              className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {isConnecting ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                'Connect'
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* CRM */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-gray-400 mb-3">CRM</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {availableIntegrations
                    .filter(i => i.category === 'crm')
                    .map((integration) => {
                      const isConnected = integrations.some(i => i.type === integration.type);
                      const isConnecting = connectingIntegration === integration.type;
                      return (
                        <div 
                          key={integration.type}
                          className="flex items-center justify-between p-4 border rounded-lg hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${integrationLogos[integration.type].bg} flex items-center justify-center text-xl`}>
                              {integrationLogos[integration.type].text}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{integration.name}</h4>
                              <p className="text-xs text-gray-500">{integration.description}</p>
                            </div>
                          </div>
                          {!isConnected && (
                            <button
                              onClick={() => handleConnectIntegration(integration.type)}
                              disabled={isConnecting}
                              className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {isConnecting ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                'Connect'
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Payments */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-gray-400 mb-3">Payments</h4>
                
                {/* Stripe Info Card - Show when connected or always show helpful info */}
                {stripeIntegration ? (
                  <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-xl">
                        💳
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-purple-900">Stripe Connected</h4>
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <ShieldCheck className="w-3 h-3" /> Active
                          </span>
                        </div>
                        <p className="text-sm text-purple-700 mb-3">
                          Your Stripe account is connected. Payments from your microsites will go directly to your Stripe account.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <a 
                            href="https://dashboard.stripe.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Stripe Dashboard
                          </a>
                          <button
                            onClick={() => setShowStripeInfo(!showStripeInfo)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                          >
                            <Info className="w-3 h-3" />
                            Setup Guide
                          </button>
                        </div>
                        
                        {/* Stripe Setup Info Expandable */}
                        {showStripeInfo && (
                          <div className="mt-4 p-3 bg-white rounded-lg border border-purple-100 text-sm space-y-2">
                            <h5 className="font-medium text-gray-900 flex items-center gap-2">
                              <Settings className="w-4 h-4" /> How to Accept Payments
                            </h5>
                            <ol className="list-decimal list-inside space-y-1 text-gray-600">
                              <li>Add a <strong>Payment Block</strong> to your microsite</li>
                              <li>Choose payment mode: Tips, Donations, or Products</li>
                              <li>Configure amounts or add products</li>
                              <li>Publish your microsite - payments will process through your connected Stripe account</li>
                            </ol>
                            <div className="pt-2 border-t border-gray-100">
                              <p className="text-xs text-gray-500">
                                <strong>Webhook URL:</strong> Stripe webhooks are automatically configured for order tracking.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-xl">
                        💳
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">Accept Payments on Your Microsites</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Connect your Stripe account to accept tips, donations, and sell products directly from your microsites.
                        </p>
                        <div className="space-y-2 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-purple-500" />
                            <span>Accept credit cards, Apple Pay, Google Pay</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-purple-500" />
                            <span>Secure OAuth connection - no API keys needed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-purple-500" />
                            <span>Payments go directly to your Stripe account</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {availableIntegrations
                    .filter(i => i.category === 'payment')
                    .map((integration) => {
                      const isConnected = integrations.some(i => i.type === integration.type);
                      const isConnecting = connectingIntegration === integration.type;
                      return (
                        <div 
                          key={integration.type}
                          className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                            isConnected 
                              ? 'bg-green-50 border-green-200' 
                              : 'hover:border-indigo-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${integrationLogos[integration.type].bg} flex items-center justify-center text-xl`}>
                              {integrationLogos[integration.type].text}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{integration.name}</h4>
                              <p className="text-xs text-gray-500">{integration.description}</p>
                            </div>
                          </div>
                          {isConnected ? (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <Check className="w-3 h-3" /> Connected
                            </span>
                          ) : (
                            <button
                              onClick={() => handleConnectIntegration(integration.type)}
                              disabled={isConnecting}
                              className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                              {isConnecting ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Connecting...
                                </>
                              ) : (
                                'Connect'
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Webhooks Tab */}
        {activeTab === 'webhooks' && (
          <div className="p-6">
            {/* Add Webhook Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowAddWebhook(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Webhook
              </button>
            </div>

            {/* Add Webhook Form */}
            {showAddWebhook && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h4 className="font-medium text-gray-900 mb-4">New Webhook</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={newWebhook.name}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Webhook"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="url"
                      value={newWebhook.url}
                      onChange={(e) => setNewWebhook(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://your-server.com/webhook"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Triggers</label>
                    <div className="flex flex-wrap gap-2">
                      {webhookTriggers.map((trigger) => (
                        <label key={trigger} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={newWebhook.triggers.includes(trigger)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewWebhook(prev => ({ ...prev, triggers: [...prev.triggers, trigger] }));
                              } else {
                                setNewWebhook(prev => ({ 
                                  ...prev, 
                                  triggers: prev.triggers.filter((t) => t !== trigger) 
                                }));
                              }
                            }}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">{trigger.replace('.', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateWebhook}
                      disabled={!newWebhook.name || !newWebhook.url || isSubmitting}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Webhook'}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddWebhook(false);
                        setNewWebhook({ name: '', url: '', triggers: ['qr.scanned', 'lead.captured'] });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Webhooks List */}
            {webhooks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Webhook className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No webhooks</h3>
                <p className="text-gray-500 mb-4">Create webhooks to receive real-time events</p>
                <button
                  onClick={() => setShowAddWebhook(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Webhook
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          webhook.isActive ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Webhook className={`w-5 h-5 ${
                            webhook.isActive ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{webhook.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              webhook.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {webhook.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 font-mono mt-1">{webhook.url}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {webhook.triggers.map((trigger) => (
                              <span key={trigger} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                {trigger.replace('.', ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleTestWebhook(webhook.id)}
                          disabled={testingWebhook === webhook.id}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                          title="Test webhook"
                        >
                          {testingWebhook === webhook.id 
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Play className="w-4 h-4" />
                          }
                        </button>
                        <button
                          onClick={() => handleToggleWebhook(webhook)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title={webhook.isActive ? 'Disable' : 'Enable'}
                        >
                          {webhook.isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteWebhook(webhook.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
