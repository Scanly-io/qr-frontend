/**
 * Agencies API
 * Handles white-label agency management, team members, and subscription tiers
 */

import { api } from './client';

export interface Agency {
  id: string;
  name: string;
  ownerId: string;
  subscriptionPlan: 'starter' | 'professional' | 'enterprise';
  whiteLabelConfig: {
    logoUrl?: string;
    primaryColor?: string;
    accentColor?: string;
    customDomain?: string;
    customCss?: string;
  };
  limits: {
    maxMicrosites: number;
    maxTeamMembers: number;
    maxCustomDomains: number;
  };
  status: 'trial' | 'active' | 'suspended';
  trialEndsAt?: string;
  monthlyRevenue: number;
  createdAt: string;
}

export interface AgencyMember {
  id: string;
  agencyId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: {
    createMicrosites: boolean;
    editMicrosites: boolean;
    deleteMicrosites: boolean;
    manageBilling: boolean;
    manageTeam: boolean;
    viewAnalytics: boolean;
  };
  email: string;
  name?: string;
  createdAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  limits: {
    maxMicrosites: number;
    maxTeamMembers: number;
    maxCustomDomains: number;
  };
  features: string[];
}

export const agenciesApi = {
  /**
   * Create a new agency
   * POST /api/auth/agencies
   */
  create: async (data: {
    name: string;
    subscriptionPlan: string;
  }): Promise<Agency> => {
    return api.post<Agency>('/auth/agencies', data);
  },

  /**
   * Get agency details
   * GET /api/auth/agencies/:id
   */
  get: async (id: string): Promise<Agency> => {
    return api.get<Agency>(`/auth/agencies/${id}`);
  },

  /**
   * Get current user's agency
   * GET /api/auth/my-agency
   */
  getMyAgency: async (): Promise<Agency | null> => {
    try {
      return await api.get<Agency>('/auth/my-agency');
    } catch {
      return null;
    }
  },

  /**
   * Update white-label configuration
   * PATCH /api/auth/agencies/:id/white-label
   */
  updateWhiteLabel: async (
    id: string,
    config: Partial<Agency['whiteLabelConfig']>
  ): Promise<Agency> => {
    return api.patch<Agency>(`/auth/agencies/${id}/white-label`, config);
  },

  /**
   * Invite team member
   * POST /api/auth/agencies/:id/members/invite
   */
  inviteMember: async (
    id: string,
    data: {
      email: string;
      role: AgencyMember['role'];
      permissions?: Partial<AgencyMember['permissions']>;
    }
  ): Promise<{ message: string; invitationId: string }> => {
    return api.post(`/auth/agencies/${id}/members/invite`, data);
  },

  /**
   * List agency members
   * GET /api/auth/agencies/:id/members
   */
  listMembers: async (id: string): Promise<AgencyMember[]> => {
    return api.get<AgencyMember[]>(`/auth/agencies/${id}/members`);
  },

  /**
   * Update member role/permissions
   * PATCH /api/auth/agencies/:id/members/:memberId
   */
  updateMember: async (
    agencyId: string,
    memberId: string,
    data: {
      role?: AgencyMember['role'];
      permissions?: Partial<AgencyMember['permissions']>;
    }
  ): Promise<AgencyMember> => {
    return api.patch<AgencyMember>(
      `/auth/agencies/${agencyId}/members/${memberId}`,
      data
    );
  },

  /**
   * Remove team member
   * DELETE /api/auth/agencies/:id/members/:memberId
   */
  removeMember: async (
    agencyId: string,
    memberId: string
  ): Promise<{ message: string }> => {
    return api.delete(`/auth/agencies/${agencyId}/members/${memberId}`);
  },

  /**
   * Get available pricing plans
   * GET /api/auth/pricing-plans
   */
  getPricingPlans: async (): Promise<PricingPlan[]> => {
    return api.get<PricingPlan[]>('/auth/pricing-plans');
  },

  /**
   * Upgrade subscription
   * POST /api/auth/agencies/:id/upgrade
   */
  upgrade: async (
    id: string,
    plan: string
  ): Promise<{ message: string; agency: Agency }> => {
    return api.post(`/auth/agencies/${id}/upgrade`, { plan });
  },
};
