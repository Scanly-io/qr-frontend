/**
 * Media API Client
 * Handles file uploads for microsites
 */

import { api, API_BASE_URL } from './client';

export interface UploadResponse {
  success: boolean;
  url: string;
  key: string;
  size: number;
  originalSize: number;
  mimetype: string;
}

export interface MultiUploadResponse {
  success: boolean;
  files: Array<{
    url: string;
    key: string;
    filename: string;
  }>;
  count: number;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  expiresIn: number;
}

export const mediaApi = {
  /**
   * Upload a single image file
   * POST /media/upload
   */
  upload: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }
    
    return response.json();
  },

  /**
   * Upload multiple image files
   * POST /media/upload-multiple
   */
  uploadMultiple: async (files: File[]): Promise<MultiUploadResponse> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const token = localStorage.getItem('accessToken');
    
    const response = await fetch(`${API_BASE_URL}/media/upload-multiple`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }
    
    return response.json();
  },

  /**
   * Get a presigned URL for direct upload to R2
   * POST /media/presigned-url
   */
  getPresignedUrl: async (filename: string, contentType: string): Promise<PresignedUrlResponse> => {
    return api.post('/media/presigned-url', { filename, contentType });
  },

  /**
   * Delete an uploaded file
   * DELETE /media/files/:key
   */
  delete: async (key: string): Promise<{ success: boolean; deleted: string }> => {
    return api.delete(`/media/files/${key}`);
  },

  /**
   * Upload from a data URL (base64)
   * Converts data URL to File and uploads
   */
  uploadFromDataUrl: async (dataUrl: string, filename: string = 'image.png'): Promise<UploadResponse> => {
    // Convert data URL to Blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    // Create File from Blob
    const file = new File([blob], filename, { type: blob.type });
    
    return mediaApi.upload(file);
  },
};
