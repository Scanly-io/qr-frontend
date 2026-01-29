/**
 * Templates API
 * Handles pre-built templates for Digital Sales Rooms and E-commerce funnels
 */

import { api } from './client';

export interface SalesRoomTemplate {
  id: string;
  name: string;
  type: 'enterprise-proposal' | 'pitch-deck' | 'contract-review';
  description: string;
  blocks: Record<string, unknown>[];
  variables: string[];
  preview: string;
}

export interface EcommerceTemplate {
  id: string;
  name: string;
  nicheCategory: 'solar-installation' | 'custom-jewelry' | 'home-energy-audit';
  description: string;
  blocks: Record<string, unknown>[];
  seoConfig: {
    structuredData: Record<string, unknown>;
    faqSchema: Record<string, unknown>;
    speakableContent: string[];
  };
  preview: string;
}

export const templatesApi = {
  /**
   * List Digital Sales Room templates
   * GET /api/microsites/templates/sales-rooms
   */
  listSalesRoomTemplates: async (): Promise<SalesRoomTemplate[]> => {
    return api.get<SalesRoomTemplate[]>('/microsites/templates/sales-rooms');
  },

  /**
   * List E-commerce templates
   * GET /api/microsites/templates/ecommerce
   */
  listEcommerceTemplates: async (): Promise<EcommerceTemplate[]> => {
    return api.get<EcommerceTemplate[]>('/microsites/templates/ecommerce');
  },

  /**
   * Create microsite from Sales Room template
   * POST /api/microsites/from-template/sales-room
   */
  createFromSalesRoom: async (data: {
    templateId: string;
    variables: Record<string, string>;
    title: string;
  }): Promise<{ id: string; slug: string }> => {
    return api.post('/microsites/from-template/sales-room', data);
  },

  /**
   * Create microsite from E-commerce template
   * POST /api/microsites/from-template/ecommerce
   */
  createFromEcommerce: async (data: {
    templateId: string;
    productName: string;
    price: number;
    checkoutUrl: string;
    title: string;
  }): Promise<{ id: string; slug: string }> => {
    return api.post('/microsites/from-template/ecommerce', data);
  },
};
