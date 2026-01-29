/**
 * Domains API Client
 * Custom Domains and Free Subdomains Service
 * 
 * Backend: domains-service (Port 3010)
 * 
 * Features:
 * - Custom domain management (scan.yourbrand.com)
 * - Free subdomain claiming (username.scanly.io)
 * - DNS verification
 * - SSL certificate management
 * - Path-based routing
 */

import { api } from './client';

// ============================================
// TYPES
// ============================================

export type DomainStatus = 
  | 'pending_verification'
  | 'verifying'
  | 'verified'
  | 'failed'
  | 'active'
  | 'suspended';

export type VerificationMethod = 'cname' | 'txt' | 'http';

export interface CustomDomain {
  id: string;
  userId: string;
  domain: string;
  status: DomainStatus;
  verificationMethod: VerificationMethod;
  verificationToken: string;
  verifiedAt?: string;
  sslEnabled: boolean;
  sslExpiresAt?: string;
  routes: DomainRoute[];
  createdAt: string;
  updatedAt: string;
}

export interface DomainRoute {
  id: string;
  domainId: string;
  path: string; // e.g., "/menu", "/contact"
  targetType: 'qr' | 'microsite' | 'url';
  targetId?: string;
  targetUrl?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Subdomain {
  id: string;
  userId: string;
  subdomain: string; // e.g., "mystore" for mystore.scanly.io
  fullDomain: string; // e.g., "mystore.scanly.io"
  status: 'pending' | 'active' | 'suspended';
  publishedAt?: string;
  routes: SubdomainRoute[];
  createdAt: string;
  updatedAt: string;
}

export interface SubdomainRoute {
  id: string;
  subdomainId: string;
  path: string;
  targetType: 'qr' | 'microsite' | 'url';
  targetId?: string;
  targetUrl?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface DomainVerificationStatus {
  domain: string;
  isVerified: boolean;
  verificationMethod: VerificationMethod;
  expectedRecord: {
    type: string;
    name: string;
    value: string;
  };
  currentRecord?: {
    type: string;
    value: string;
  };
  lastCheckedAt: string;
  error?: string;
}

export interface CreateDomainInput {
  domain: string;
  verificationMethod?: VerificationMethod;
}

export interface CreateRouteInput {
  path: string;
  targetType: 'qr' | 'microsite' | 'url';
  targetId?: string;
  targetUrl?: string;
  isDefault?: boolean;
}

// ============================================
// API FUNCTIONS
// ============================================

export const domainsApi = {
  // ============================================
  // CUSTOM DOMAINS
  // ============================================

  /**
   * List all custom domains
   */
  listDomains: async (): Promise<{ domains: CustomDomain[] }> => {
    return api.get('/domains');
  },

  /**
   * Get a single domain
   */
  getDomain: async (domainId: string): Promise<CustomDomain> => {
    return api.get(`/domains/${domainId}`);
  },

  /**
   * Add a new custom domain
   */
  addDomain: async (data: CreateDomainInput): Promise<{
    domain: CustomDomain;
    verificationInstructions: {
      method: VerificationMethod;
      recordType: string;
      recordName: string;
      recordValue: string;
      instructions: string;
    };
  }> => {
    return api.post('/domains', data);
  },

  /**
   * Delete a custom domain
   */
  deleteDomain: async (domainId: string): Promise<void> => {
    return api.delete(`/domains/${domainId}`);
  },

  /**
   * Verify domain DNS configuration
   */
  verifyDomain: async (domainId: string): Promise<DomainVerificationStatus> => {
    return api.post(`/domains/${domainId}/verify`);
  },

  /**
   * Get verification status
   */
  getVerificationStatus: async (domainId: string): Promise<DomainVerificationStatus> => {
    return api.get(`/domains/${domainId}/verification-status`);
  },

  /**
   * Request SSL certificate
   */
  requestSSL: async (domainId: string): Promise<{ 
    success: boolean; 
    sslStatus: 'pending' | 'issued' | 'failed';
    expiresAt?: string;
  }> => {
    return api.post(`/domains/${domainId}/ssl`);
  },

  // ============================================
  // DOMAIN ROUTES
  // ============================================

  /**
   * List routes for a domain
   */
  listDomainRoutes: async (domainId: string): Promise<{ routes: DomainRoute[] }> => {
    return api.get(`/domains/${domainId}/routes`);
  },

  /**
   * Add a route to a domain
   */
  addDomainRoute: async (domainId: string, data: CreateRouteInput): Promise<DomainRoute> => {
    return api.post(`/domains/${domainId}/routes`, data);
  },

  /**
   * Update a domain route
   */
  updateDomainRoute: async (
    domainId: string, 
    routeId: string, 
    data: Partial<CreateRouteInput>
  ): Promise<DomainRoute> => {
    return api.patch(`/domains/${domainId}/routes/${routeId}`, data);
  },

  /**
   * Delete a domain route
   */
  deleteDomainRoute: async (domainId: string, routeId: string): Promise<void> => {
    return api.delete(`/domains/${domainId}/routes/${routeId}`);
  },

  // ============================================
  // FREE SUBDOMAINS
  // ============================================

  /**
   * Check if a subdomain is available
   */
  checkSubdomainAvailability: async (subdomain: string): Promise<{
    available: boolean;
    subdomain: string;
    fullDomain: string;
    reason?: string;
  }> => {
    return api.get(`/subdomains/check?subdomain=${encodeURIComponent(subdomain)}`);
  },

  /**
   * Claim a free subdomain
   */
  claimSubdomain: async (subdomain: string): Promise<Subdomain> => {
    return api.post('/subdomains/claim', { subdomain });
  },

  /**
   * Get user's subdomain
   */
  getMySubdomain: async (): Promise<Subdomain | null> => {
    return api.get('/subdomains/mine');
  },

  /**
   * Release a subdomain
   */
  releaseSubdomain: async (subdomainId: string): Promise<void> => {
    return api.delete(`/subdomains/${subdomainId}`);
  },

  /**
   * Publish subdomain (make it live)
   */
  publishSubdomain: async (subdomainId: string): Promise<{
    success: boolean;
    publishedAt: string;
    url: string;
  }> => {
    return api.post(`/subdomains/${subdomainId}/publish`);
  },

  /**
   * Unpublish subdomain (take offline)
   */
  unpublishSubdomain: async (subdomainId: string): Promise<void> => {
    return api.post(`/subdomains/${subdomainId}/unpublish`);
  },

  // ============================================
  // SUBDOMAIN ROUTES
  // ============================================

  /**
   * List routes for a subdomain
   */
  listSubdomainRoutes: async (subdomainId: string): Promise<{ routes: SubdomainRoute[] }> => {
    return api.get(`/subdomains/${subdomainId}/routes`);
  },

  /**
   * Add a route to a subdomain
   */
  addSubdomainRoute: async (subdomainId: string, data: CreateRouteInput): Promise<SubdomainRoute> => {
    return api.post(`/subdomains/${subdomainId}/routes`, data);
  },

  /**
   * Update a subdomain route
   */
  updateSubdomainRoute: async (
    subdomainId: string, 
    routeId: string, 
    data: Partial<CreateRouteInput>
  ): Promise<SubdomainRoute> => {
    return api.patch(`/subdomains/${subdomainId}/routes/${routeId}`, data);
  },

  /**
   * Delete a subdomain route
   */
  deleteSubdomainRoute: async (subdomainId: string, routeId: string): Promise<void> => {
    return api.delete(`/subdomains/${subdomainId}/routes/${routeId}`);
  },
};
