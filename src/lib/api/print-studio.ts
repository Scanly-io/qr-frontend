/**
 * Print Studio Service API Client
 * Handles batch QR printing, label templates, and print jobs
 */
import { api, API_BASE_URL } from './client';

// ============================================================
// TYPES
// ============================================================

export type LabelFormat = 'avery-5160' | 'avery-5163' | 'avery-5167' | 'dymo-30252' | 'dymo-30336' | 'custom';

export interface LabelFormatSpec {
  name: string;
  width: number;
  height: number;
  cols: number;
  rows: number;
  pageWidth: number;
  pageHeight: number;
}

export const LABEL_FORMATS: Record<LabelFormat, LabelFormatSpec> = {
  'avery-5160': { name: 'Avery 5160', width: 66.675, height: 25.4, cols: 3, rows: 10, pageWidth: 215.9, pageHeight: 279.4 },
  'avery-5163': { name: 'Avery 5163', width: 101.6, height: 50.8, cols: 2, rows: 5, pageWidth: 215.9, pageHeight: 279.4 },
  'avery-5167': { name: 'Avery 5167', width: 44.45, height: 12.7, cols: 4, rows: 20, pageWidth: 215.9, pageHeight: 279.4 },
  'dymo-30252': { name: 'DYMO 30252', width: 28.575, height: 62.738, cols: 1, rows: 1, pageWidth: 28.575, pageHeight: 62.738 },
  'dymo-30336': { name: 'DYMO 30336', width: 25.4, height: 89, cols: 1, rows: 1, pageWidth: 25.4, pageHeight: 89 },
  'custom': { name: 'Custom Size', width: 100, height: 50, cols: 2, rows: 5, pageWidth: 210, pageHeight: 297 },
};

export interface TemplateElement {
  type: 'qr' | 'text' | 'image' | 'barcode';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  dataField?: string; // For dynamic data mapping
}

export interface TemplateDesign {
  elements: TemplateElement[];
  qrSize?: number;
  qrMargin?: number;
}

export interface PrintTemplate {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  labelFormat: LabelFormat;
  pageWidth: number;
  pageHeight: number;
  labelWidth: number;
  labelHeight: number;
  columns: number;
  rows: number;
  design: TemplateDesign;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  labelFormat: LabelFormat;
  pageWidth?: number;
  pageHeight?: number;
  labelWidth?: number;
  labelHeight?: number;
  columns?: number;
  rows?: number;
  design?: TemplateDesign;
}

export type UpdateTemplateInput = Partial<CreateTemplateInput>;

export interface QRCodeItem {
  id: string;
  url: string;
  data?: Record<string, unknown>; // For dynamic text replacement
}

export interface PrintJob {
  id: string;
  organizationId: string;
  name: string;
  templateId: string;
  qrCodes: QRCodeItem[];
  totalQRs: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  pdfUrl?: string;
  errorMessage?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface CreatePrintJobInput {
  name: string;
  templateId: string;
  qrCodes: QRCodeItem[];
}

export interface LibraryTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  labelFormat: LabelFormat;
  design: TemplateDesign;
  isPremium: boolean;
  downloadCount: number;
}

// ============================================================
// API FUNCTIONS - TEMPLATES
// ============================================================

export const templatesApi = {
  async list(params?: { limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    
    const queryString = query.toString();
    const response = await api.get<{ templates: PrintTemplate[] }>(`/print-studio/templates${queryString ? `?${queryString}` : ''}`);
    return response.templates;
  },

  async get(id: string) {
    return api.get<PrintTemplate>(`/print-studio/templates/${id}`);
  },

  async create(data: CreateTemplateInput) {
    return api.post<PrintTemplate>('/print-studio/templates', data);
  },

  async update(id: string, data: UpdateTemplateInput) {
    return api.patch<PrintTemplate>(`/print-studio/templates/${id}`, data);
  },

  async delete(id: string) {
    return api.delete(`/print-studio/templates/${id}`);
  },

  async duplicate(id: string, name?: string) {
    return api.post<PrintTemplate>(`/print-studio/templates/${id}/duplicate`, { name });
  },
};

// ============================================================
// API FUNCTIONS - BATCH JOBS
// ============================================================

export const batchApi = {
  async list(params?: { status?: PrintJob['status']; limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    
    const queryString = query.toString();
    const response = await api.get<{ jobs: PrintJob[] }>(`/print-studio/batch${queryString ? `?${queryString}` : ''}`);
    return response.jobs;
  },

  async get(id: string) {
    return api.get<PrintJob>(`/print-studio/batch/${id}`);
  },

  async create(data: CreatePrintJobInput) {
    return api.post<PrintJob>('/print-studio/batch', data);
  },

  async cancel(id: string) {
    return api.post<PrintJob>(`/print-studio/batch/${id}/cancel`, {});
  },

  async retry(id: string) {
    return api.post<PrintJob>(`/print-studio/batch/${id}/retry`, {});
  },

  async delete(id: string) {
    return api.delete(`/print-studio/batch/${id}`);
  },

  async downloadPdf(id: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/print-studio/batch/${id}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }
    
    return response.blob();
  },

  async preview(id: string): Promise<string> {
    const blob = await this.downloadPdf(id);
    return URL.createObjectURL(blob);
  },
};

// ============================================================
// API FUNCTIONS - TEMPLATE LIBRARY
// ============================================================

export const templateLibraryApi = {
  async list(params?: { category?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    
    const queryString = query.toString();
    const response = await api.get<{ templates: LibraryTemplate[] }>(`/print-studio/library${queryString ? `?${queryString}` : ''}`);
    return response.templates;
  },

  async getCategories() {
    const response = await api.get<{ categories: string[] }>('/print-studio/library/categories');
    return response.categories;
  },

  async useTemplate(libraryTemplateId: string, name?: string) {
    return api.post<PrintTemplate>(`/print-studio/library/${libraryTemplateId}/use`, { name });
  },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getLabelFormat(format: LabelFormat): LabelFormatSpec {
  return LABEL_FORMATS[format];
}

export function getLabelsPerPage(format: LabelFormat): number {
  const spec = LABEL_FORMATS[format];
  return spec.cols * spec.rows;
}

export function calculatePagesNeeded(qrCount: number, format: LabelFormat): number {
  const labelsPerPage = getLabelsPerPage(format);
  return Math.ceil(qrCount / labelsPerPage);
}

// ============================================================
// COMBINED EXPORT
// ============================================================

export const printStudioApi = {
  templates: templatesApi,
  batch: batchApi,
  library: templateLibraryApi,
  
  // Utilities
  getLabelFormat,
  getLabelsPerPage,
  calculatePagesNeeded,
  LABEL_FORMATS,
};

export default printStudioApi;
