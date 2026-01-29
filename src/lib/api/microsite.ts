/**
 * Microsite API
 * Handles microsite CRUD operations and publishing
 */

import { api } from './client';
import type { MicrositeData, UpdateMicrositePayload, PublishResponse } from './types';

export const micrositeApi = {
  /**
   * Create a new microsite
   * POST /microsite
   */
  create: async (data: { title: string; description?: string; theme?: Record<string, unknown>; layout?: unknown[] }): Promise<MicrositeData> => {
    return api.post<MicrositeData>('/microsite', data);
  },

  /**
   * List all microsites for authenticated user
   * GET /microsite
   */
  list: async (): Promise<MicrositeData[]> => {
    return api.get<MicrositeData[]>('/microsite');
  },

  /**
   * Get microsite by ID (primary key)
   * GET /microsite/:id
   */
  get: async (id: string): Promise<MicrositeData> => {
    return api.get<MicrositeData>(`/microsite/${id}`);
  },

  /**
   * Get microsite by QR ID (backward compatibility)
   * GET /microsite/qr/:qrId
   */
  getByQrId: async (qrId: string): Promise<MicrositeData> => {
    return api.get<MicrositeData>(`/microsite/qr/${qrId}`);
  },

  /**
   * Update microsite
   * PUT /microsite/:id
   */
  update: async (id: string, data: UpdateMicrositePayload): Promise<{ message: string }> => {
    return api.put<{ message: string }>(`/microsite/${id}`, data);
  },

  /**
   * Delete microsite
   * DELETE /microsite/:id
   */
  delete: async (id: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/microsite/${id}`);
  },

  /**
   * Generate QR code for microsite
   * POST /microsite/:id/generate-qr
   */
  generateQr: async (id: string): Promise<{
    message: string;
    qrId: string;
    publicUrl: string;
    qrImageUrl: string;
    shareUrl: string;
  }> => {
    return api.post(`/microsite/${id}/generate-qr`);
  },

  /**
   * Get WhatsApp share link
   * GET /microsite/:id/whatsapp-share
   */
  getWhatsAppShare: async (id: string): Promise<{
    micrositeUrl: string;
    whatsappShareUrl: string;
    title: string;
  }> => {
    return api.get(`/microsite/${id}/whatsapp-share`);
  },

  /**
   * Publish microsite (renders HTML)
   * POST /microsite/:qrId/publish
   */
  publish: async (qrId: string): Promise<PublishResponse> => {
    return api.post<PublishResponse>(`/microsite/${qrId}/publish`);
  },

  /**
   * Get public microsite (no auth required)
   * GET /public/:qrId
   */
  getPublic: async (qrId: string): Promise<string> => {
    // This returns HTML, not JSON
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost'}/public/${qrId}`);
    if (!response.ok) {
      throw new Error(`Failed to load microsite: ${response.status}`);
    }
    return response.text();
  },

  /**
   * Submit lead/form from public microsite
   * POST /public/:qrId/lead
   */
  submitLead: async (qrId: string, leadData: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
    micrositeId: string;
    consent: boolean;
  }): Promise<{ success: boolean }> => {
    return api.post<{ success: boolean }>(`/public/${qrId}/lead`, leadData);
  },
  
  /**
   * Duplicate a microsite (creates a copy)
   * Client-side implementation: fetch microsite, create new one with same data
   */
  duplicate: async (id: string): Promise<MicrositeData> => {
    // Get the source microsite
    const source = await api.get<MicrositeData>(`/microsite/${id}`);
    
    // Create a new microsite with the same data
    return api.post<MicrositeData>('/microsite', {
      title: `${source.title} (Copy)`,
      description: source.description,
      theme: source.theme,
      layout: source.layout,
    });
  },
};
