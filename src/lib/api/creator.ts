/**
 * Creator Service API Client
 * Handles products, earnings, social planner, collections, auto-reply, and content ideas
 */
import { api } from './client';

// ============================================================
// TYPES
// ============================================================

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  productType: 'digital' | 'physical' | 'service' | 'course' | 'membership';
  price: number;
  currency: string;
  images: string[];
  downloadUrl?: string;
  courseUrl?: string;
  inventory?: number;
  status: 'active' | 'draft' | 'archived';
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  productType: Product['productType'];
  price: number;
  currency?: string;
  images?: string[];
  downloadUrl?: string;
  courseUrl?: string;
  inventory?: number;
  status?: Product['status'];
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface EarningsOverview {
  totalRevenue: number;
  netEarnings: number;
  platformFees: number;
  transactionCount: number;
  currency: string;
  period: {
    start: string;
    end: string;
  };
  bySource: {
    source: string;
    amount: number;
    count: number;
  }[];
}

export interface EarningsChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export interface ScheduledPost {
  id: string;
  organizationId: string;
  content: string;
  mediaUrls?: string[];
  platforms: string[];
  scheduledAt: string;
  status: 'scheduled' | 'posted' | 'failed' | 'draft';
  postedAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduledPostInput {
  content: string;
  mediaUrls?: string[];
  platforms: string[];
  scheduledAt: string;
  status?: ScheduledPost['status'];
}

export interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  displayName?: string;
  profileImage?: string;
  isConnected: boolean;
  lastSyncAt?: string;
}

export interface Collection {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  coverImage?: string;
  items: CollectionItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionItem {
  type: 'product' | 'link' | 'media';
  id: string;
  title: string;
  thumbnail?: string;
  url?: string;
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
  coverImage?: string;
  items?: CollectionItem[];
  isPublic?: boolean;
}

export interface AutoReplyRule {
  id: string;
  organizationId: string;
  name: string;
  trigger: {
    type: 'keyword' | 'mention' | 'dm' | 'comment';
    keywords?: string[];
    platforms?: string[];
  };
  response: {
    message: string;
    delay?: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAutoReplyInput {
  name: string;
  trigger: AutoReplyRule['trigger'];
  response: AutoReplyRule['response'];
  isActive?: boolean;
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  platforms: string[];
  estimatedEngagement: 'low' | 'medium' | 'high';
  trending: boolean;
  savedAt?: string;
}

// ============================================================
// API FUNCTIONS - PRODUCTS
// ============================================================

export const productsApi = {
  async list(params?: { limit?: number; offset?: number; status?: Product['status']; productType?: Product['productType'] }) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    if (params?.status) query.set('status', params.status);
    if (params?.productType) query.set('productType', params.productType);
    
    const queryString = query.toString();
    const response = await api.get<{ products: Product[] }>(`/creator/products${queryString ? `?${queryString}` : ''}`);
    return response.products;
  },

  async get(id: string) {
    return api.get<Product>(`/creator/products/${id}`);
  },

  async create(data: CreateProductInput) {
    return api.post<Product>('/creator/products', data);
  },

  async update(id: string, data: UpdateProductInput) {
    return api.patch<Product>(`/creator/products/${id}`, data);
  },

  async delete(id: string) {
    return api.delete(`/creator/products/${id}`);
  },
};

// ============================================================
// API FUNCTIONS - EARNINGS
// ============================================================

export const earningsApi = {
  async getOverview(params?: { startDate?: string; endDate?: string; source?: string }) {
    const query = new URLSearchParams();
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    if (params?.source) query.set('source', params.source);
    
    const queryString = query.toString();
    return api.get<EarningsOverview>(`/creator/earnings${queryString ? `?${queryString}` : ''}`);
  },

  async getChartData(params?: { period?: 'day' | 'week' | 'month' | 'year'; startDate?: string; endDate?: string }) {
    const query = new URLSearchParams();
    if (params?.period) query.set('period', params.period);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    
    const queryString = query.toString();
    return api.get<EarningsChartData>(`/creator/earnings/chart${queryString ? `?${queryString}` : ''}`);
  },
};

// ============================================================
// API FUNCTIONS - SOCIAL PLANNER
// ============================================================

export const socialPlannerApi = {
  async listPosts(params?: { limit?: number; offset?: number; status?: ScheduledPost['status'] }) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    if (params?.status) query.set('status', params.status);
    
    const queryString = query.toString();
    const response = await api.get<{ posts: ScheduledPost[] }>(`/creator/social-planner/posts${queryString ? `?${queryString}` : ''}`);
    return response.posts;
  },

  async getPost(id: string) {
    return api.get<ScheduledPost>(`/creator/social-planner/posts/${id}`);
  },

  async createPost(data: CreateScheduledPostInput) {
    return api.post<ScheduledPost>('/creator/social-planner/posts', data);
  },

  async updatePost(id: string, data: Partial<CreateScheduledPostInput>) {
    return api.patch<ScheduledPost>(`/creator/social-planner/posts/${id}`, data);
  },

  async deletePost(id: string) {
    return api.delete(`/creator/social-planner/posts/${id}`);
  },

  async getAccounts() {
    const response = await api.get<{ accounts: SocialAccount[] }>('/creator/social-planner/accounts');
    return response.accounts;
  },

  async connectAccount(platform: string, authData: Record<string, unknown>) {
    return api.post<SocialAccount>('/creator/social-planner/accounts', { platform, ...authData });
  },

  async disconnectAccount(id: string) {
    return api.delete(`/creator/social-planner/accounts/${id}`);
  },
};

// ============================================================
// API FUNCTIONS - COLLECTIONS
// ============================================================

export const collectionsApi = {
  async list(params?: { limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    
    const queryString = query.toString();
    const response = await api.get<{ collections: Collection[] }>(`/creator/collections${queryString ? `?${queryString}` : ''}`);
    return response.collections;
  },

  async get(id: string) {
    return api.get<Collection>(`/creator/collections/${id}`);
  },

  async create(data: CreateCollectionInput) {
    return api.post<Collection>('/creator/collections', data);
  },

  async update(id: string, data: Partial<CreateCollectionInput>) {
    return api.patch<Collection>(`/creator/collections/${id}`, data);
  },

  async delete(id: string) {
    return api.delete(`/creator/collections/${id}`);
  },

  async addItem(collectionId: string, item: CollectionItem) {
    return api.post<Collection>(`/creator/collections/${collectionId}/items`, item);
  },

  async removeItem(collectionId: string, itemId: string) {
    return api.delete(`/creator/collections/${collectionId}/items/${itemId}`);
  },
};

// ============================================================
// API FUNCTIONS - AUTO REPLY
// ============================================================

export const autoReplyApi = {
  async list(params?: { limit?: number; offset?: number; isActive?: boolean }) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    if (params?.isActive !== undefined) query.set('isActive', String(params.isActive));
    
    const queryString = query.toString();
    const response = await api.get<{ rules: AutoReplyRule[] }>(`/creator/auto-reply${queryString ? `?${queryString}` : ''}`);
    return response.rules;
  },

  async get(id: string) {
    return api.get<AutoReplyRule>(`/creator/auto-reply/${id}`);
  },

  async create(data: CreateAutoReplyInput) {
    return api.post<AutoReplyRule>('/creator/auto-reply', data);
  },

  async update(id: string, data: Partial<CreateAutoReplyInput>) {
    return api.patch<AutoReplyRule>(`/creator/auto-reply/${id}`, data);
  },

  async delete(id: string) {
    return api.delete(`/creator/auto-reply/${id}`);
  },

  async toggle(id: string, isActive: boolean) {
    return api.patch<AutoReplyRule>(`/creator/auto-reply/${id}`, { isActive });
  },
};

// ============================================================
// API FUNCTIONS - CONTENT IDEAS
// ============================================================

export const contentIdeasApi = {
  async generate(params?: { category?: string; platforms?: string[]; count?: number }) {
    return api.post<{ ideas: ContentIdea[] }>('/creator/content-ideas/generate', params || {});
  },

  async getTrending(params?: { platforms?: string[] }) {
    const query = new URLSearchParams();
    if (params?.platforms) query.set('platforms', params.platforms.join(','));
    
    const queryString = query.toString();
    return api.get<{ ideas: ContentIdea[] }>(`/creator/content-ideas/trending${queryString ? `?${queryString}` : ''}`);
  },

  async save(ideaId: string) {
    return api.post<ContentIdea>(`/creator/content-ideas/${ideaId}/save`, {});
  },

  async getSaved() {
    const response = await api.get<{ ideas: ContentIdea[] }>('/creator/content-ideas/saved');
    return response.ideas;
  },

  async unsave(ideaId: string) {
    return api.delete(`/creator/content-ideas/${ideaId}/save`);
  },
};

// ============================================================
// COMBINED EXPORT
// ============================================================

export const creatorApi = {
  products: productsApi,
  earnings: earningsApi,
  socialPlanner: socialPlannerApi,
  collections: collectionsApi,
  autoReply: autoReplyApi,
  contentIdeas: contentIdeasApi,
};

export default creatorApi;
