/**
 * QR Code API Client
 * 
 * Handles QR code generation and management
 */

import { apiCall } from './client';

export interface QRGenerateRequest {
  targetUrl: string;
  qrId?: string;
  metadata?: {
    name?: string;
    micrositeId?: string;
    [key: string]: unknown;
  };
}

export interface QRGenerateResponse {
  qrId: string;
  targetUrl: string;
  shortUrl?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface QRDetailsResponse {
  qrId: string;
  targetUrl: string;
  shortUrl?: string;
  imageUrl?: string;
  scans: number;
  createdAt: string;
  updatedAt: string;
}

export const qrApi = {
  /**
   * Generate a new QR code
   */
  generate: async (data: QRGenerateRequest): Promise<QRGenerateResponse> => {
    return apiCall<QRGenerateResponse>('/qr/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get QR code details
   */
  get: async (qrId: string): Promise<QRDetailsResponse> => {
    return apiCall<QRDetailsResponse>(`/qr/${qrId}`);
  },

  /**
   * Get QR code image URL
   */
  getImageUrl: (qrId: string): string => {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    return `${baseUrl}/qr/${qrId}/image`;
  },

  /**
   * Download QR code image
   */
  downloadImage: async (qrId: string): Promise<Blob> => {
    const imageUrl = qrApi.getImageUrl(qrId);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to download QR code image');
    }
    return response.blob();
  },
};
