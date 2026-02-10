/**
 * Domains Settings Component
 * Manage custom domains and subdomains
 */

import { useState, useEffect } from 'react';
import { 
  Globe, 
  Plus, 
  Check, 
  X, 
  AlertCircle, 
  ExternalLink,
  Copy,
  RefreshCw,
  Trash2,
  Shield,
  Loader2
} from 'lucide-react';
import { domainsApi } from '../../lib/api';
import type { CustomDomain, Subdomain, DomainVerificationStatus } from '../../lib/api';

export function DomainsSettings() {
  const [customDomains, setCustomDomains] = useState<CustomDomain[]>([]);
  const [subdomain, setSubdomain] = useState<Subdomain | null>(null);
  const [verificationStatuses, setVerificationStatuses] = useState<Record<string, DomainVerificationStatus>>({});
  const [loading, setLoading] = useState(true);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      setLoading(true);
      const [domainsRes, subdomainRes] = await Promise.all([
        domainsApi.listDomains(),
        domainsApi.getMySubdomain().catch(() => null)
      ]);
      setCustomDomains(domainsRes.domains);
      setSubdomain(subdomainRes);
      
      // Load verification statuses for pending domains
      const pendingDomains = domainsRes.domains.filter(d => d.status === 'pending_verification');
      const statuses: Record<string, DomainVerificationStatus> = {};
      for (const domain of pendingDomains) {
        try {
          const status = await domainsApi.getVerificationStatus(domain.id);
          statuses[domain.id] = status;
        } catch {
          // Ignore errors
        }
      }
      setVerificationStatuses(statuses);
    } catch (error) {
      console.error('Failed to load domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;
    
    try {
      setIsSubmitting(true);
      const result = await domainsApi.addDomain({ domain: newDomain.trim() });
      setCustomDomains(prev => [...prev, result.domain]);
      setVerificationStatuses(prev => ({
        ...prev,
        [result.domain.id]: {
          domain: result.domain.domain,
          isVerified: false,
          verificationMethod: result.verificationInstructions.method,
          expectedRecord: {
            type: result.verificationInstructions.recordType,
            name: result.verificationInstructions.recordName,
            value: result.verificationInstructions.recordValue,
          },
          lastCheckedAt: new Date().toISOString(),
        }
      }));
      setNewDomain('');
      setShowAddDomain(false);
    } catch (error) {
      console.error('Failed to add domain:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      const result = await domainsApi.verifyDomain(domainId);
      setVerificationStatuses(prev => ({ ...prev, [domainId]: result }));
      if (result.isVerified) {
        loadDomains();
      }
    } catch (error) {
      console.error('Failed to verify domain:', error);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;
    
    try {
      await domainsApi.deleteDomain(domainId);
      setCustomDomains(prev => prev.filter(d => d.id !== domainId));
    } catch (error) {
      console.error('Failed to delete domain:', error);
    }
  };

  const handleClaimSubdomain = async () => {
    if (!newSubdomain.trim()) return;
    
    try {
      setIsSubmitting(true);
      const sub = await domainsApi.claimSubdomain(newSubdomain.trim());
      setSubdomain(sub);
      setNewSubdomain('');
    } catch (error) {
      console.error('Failed to claim subdomain:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusBadge = (status: CustomDomain['status']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <Check className="w-3 h-3" /> Verified
          </span>
        );
      case 'pending_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <AlertCircle className="w-3 h-3" /> Pending Verification
          </span>
        );
      case 'verifying':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <Shield className="w-3 h-3" /> Verifying
          </span>
        );
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <Check className="w-3 h-3" /> Active
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <X className="w-3 h-3" /> Failed
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <AlertCircle className="w-3 h-3" /> Suspended
          </span>
        );
      default:
        return null;
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
      {/* Free Subdomain Section */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600">
          <h2 className="text-lg font-semibold text-white">Free Subdomain</h2>
          <p className="text-sm text-indigo-100 mt-1">
            Claim your free subdomain (yourname.scanwyse.io)
          </p>
        </div>
        <div className="p-6">
          {subdomain ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{subdomain.subdomain}.scanwyse.io</p>
                  <p className="text-sm text-gray-500">Your free subdomain</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(`https://${subdomain.subdomain}.scanwyse.io`)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`https://${subdomain.subdomain}.scanwyse.io`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={newSubdomain}
                    onChange={(e) => setNewSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="yourname"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    .scanwyse.io
                  </span>
                </div>
                <button
                  onClick={handleClaimSubdomain}
                  disabled={!newSubdomain.trim() || isSubmitting}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Claim'}
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Choose a unique subdomain for your QR codes and microsites.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Domains Section */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Custom Domains</h2>
            <p className="text-sm text-gray-500 mt-1">
              Connect your own domain for branded QR destinations
            </p>
          </div>
          <button
            onClick={() => setShowAddDomain(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Domain
          </button>
        </div>

        {/* Add Domain Form */}
        {showAddDomain && (
          <div className="p-6 border-b bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="links.yourdomain.com"
                className="flex-grow px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={handleAddDomain}
                disabled={!newDomain.trim() || isSubmitting}
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Add'}
              </button>
              <button
                onClick={() => {
                  setShowAddDomain(false);
                  setNewDomain('');
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Domains List */}
        <div className="divide-y">
          {customDomains.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No custom domains</h3>
              <p className="text-gray-500 mb-4">Add your own domain to use branded URLs</p>
              <button
                onClick={() => setShowAddDomain(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Domain
              </button>
            </div>
          ) : (
            customDomains.map((domain) => (
              <div key={domain.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">{domain.domain}</h3>
                        {getStatusBadge(domain.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Added {new Date(domain.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {domain.status === 'pending_verification' && (
                      <button
                        onClick={() => handleVerifyDomain(domain.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteDomain(domain.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* DNS Records */}
                {domain.status === 'pending_verification' && verificationStatuses[domain.id] && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2">DNS Configuration Required</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Add the following DNS record to verify domain ownership:
                    </p>
                    <div className="bg-white p-3 rounded border border-yellow-200 font-mono text-sm">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-gray-500 text-xs block mb-1">Type</span>
                          <span className="text-gray-900">{verificationStatuses[domain.id].expectedRecord.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block mb-1">Name</span>
                          <span className="text-gray-900">{verificationStatuses[domain.id].expectedRecord.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block mb-1">Value</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 truncate">{verificationStatuses[domain.id].expectedRecord.value}</span>
                            <button
                              onClick={() => copyToClipboard(verificationStatuses[domain.id].expectedRecord.value)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
