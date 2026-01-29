/**
 * Workflow Builder Service API Client
 * Handles automation workflows with visual node-based builder
 */
import { api } from './client';

// ============================================================
// TYPES
// ============================================================

export type TriggerType = 'qr-scan' | 'webhook' | 'schedule' | 'manual' | 'database-event';
export type NodeType = 'trigger' | 'action' | 'condition' | 'delay' | 'transform' | 'output';
export type ActionType = 
  | 'send-email' 
  | 'send-sms' 
  | 'send-webhook' 
  | 'update-database'
  | 'create-qr'
  | 'send-notification'
  | 'add-to-list'
  | 'remove-from-list'
  | 'set-variable'
  | 'run-script';

export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  data: {
    label: string;
    actionType?: ActionType;
    config?: Record<string, unknown>;
  };
  position: Position;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  condition?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte';
    value: string | number | boolean;
  };
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface WorkflowTrigger {
  type: TriggerType;
  config: {
    // QR Scan
    qrCodeId?: string;
    qrCodeIds?: string[];
    
    // Webhook
    webhookUrl?: string;
    secret?: string;
    
    // Schedule (cron)
    schedule?: string;
    timezone?: string;
    
    // Database event
    table?: string;
    event?: 'insert' | 'update' | 'delete';
    
    // Custom filters
    filters?: Record<string, unknown>;
  };
}

export interface Workflow {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  definition: WorkflowDefinition;
  trigger: WorkflowTrigger;
  category?: string;
  tags?: string[];
  status: 'draft' | 'active' | 'paused' | 'archived';
  stats?: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    lastRunAt?: string;
    averageRunTime?: number;
  };
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowInput {
  name: string;
  description?: string;
  definition: WorkflowDefinition;
  trigger: WorkflowTrigger;
  category?: string;
  tags?: string[];
}

export interface UpdateWorkflowInput extends Partial<CreateWorkflowInput> {
  status?: Workflow['status'];
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  triggerData?: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  nodeResults?: {
    nodeId: string;
    status: 'success' | 'failure' | 'skipped';
    output?: unknown;
    error?: string;
    duration: number;
  }[];
  startedAt: string;
  completedAt?: string;
  duration?: number;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  definition: WorkflowDefinition;
  trigger: WorkflowTrigger;
  tags: string[];
  usageCount: number;
}

// ============================================================
// API FUNCTIONS - WORKFLOWS
// ============================================================

export const workflowsApi = {
  async list(params?: { status?: Workflow['status']; category?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    
    const queryString = query.toString();
    const response = await api.get<{ workflows: Workflow[] }>(`/workflow/workflows${queryString ? `?${queryString}` : ''}`);
    return response.workflows;
  },

  async get(id: string) {
    return api.get<Workflow>(`/workflow/workflows/${id}`);
  },

  async create(data: CreateWorkflowInput) {
    return api.post<Workflow>('/workflow/workflows', data);
  },

  async update(id: string, data: UpdateWorkflowInput) {
    return api.patch<Workflow>(`/workflow/workflows/${id}`, data);
  },

  async delete(id: string) {
    return api.delete(`/workflow/workflows/${id}`);
  },

  async duplicate(id: string, name?: string) {
    return api.post<Workflow>(`/workflow/workflows/${id}/duplicate`, { name });
  },

  async activate(id: string) {
    return api.patch<Workflow>(`/workflow/workflows/${id}`, { status: 'active' });
  },

  async pause(id: string) {
    return api.patch<Workflow>(`/workflow/workflows/${id}`, { status: 'paused' });
  },

  async archive(id: string) {
    return api.patch<Workflow>(`/workflow/workflows/${id}`, { status: 'archived' });
  },

  async test(id: string, testData?: Record<string, unknown>) {
    return api.post<WorkflowRun>(`/workflow/workflows/${id}/test`, { testData });
  },

  async trigger(id: string, triggerData?: Record<string, unknown>) {
    return api.post<WorkflowRun>(`/workflow/workflows/${id}/trigger`, { triggerData });
  },
};

// ============================================================
// API FUNCTIONS - WORKFLOW RUNS
// ============================================================

export const runsApi = {
  async list(workflowId: string, params?: { status?: WorkflowRun['status']; limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    
    const queryString = query.toString();
    const response = await api.get<{ runs: WorkflowRun[] }>(`/workflow/workflows/${workflowId}/runs${queryString ? `?${queryString}` : ''}`);
    return response.runs;
  },

  async get(workflowId: string, runId: string) {
    return api.get<WorkflowRun>(`/workflow/workflows/${workflowId}/runs/${runId}`);
  },

  async cancel(workflowId: string, runId: string) {
    return api.post<WorkflowRun>(`/workflow/workflows/${workflowId}/runs/${runId}/cancel`, {});
  },

  async retry(workflowId: string, runId: string) {
    return api.post<WorkflowRun>(`/workflow/workflows/${workflowId}/runs/${runId}/retry`, {});
  },
};

// ============================================================
// API FUNCTIONS - TEMPLATES
// ============================================================

export const workflowTemplatesApi = {
  async list(params?: { category?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    
    const queryString = query.toString();
    const response = await api.get<{ templates: WorkflowTemplate[] }>(`/workflow/templates${queryString ? `?${queryString}` : ''}`);
    return response.templates;
  },

  async getCategories() {
    const response = await api.get<{ categories: string[] }>('/workflow/templates/categories');
    return response.categories;
  },

  async useTemplate(templateId: string, name?: string) {
    return api.post<Workflow>(`/workflow/templates/${templateId}/use`, { name });
  },
};

// ============================================================
// PRE-BUILT WORKFLOW TEMPLATES (CLIENT-SIDE)
// ============================================================

export const WORKFLOW_PRESETS: Partial<WorkflowTemplate>[] = [
  {
    id: 'welcome-email',
    name: 'Welcome Email on First Scan',
    description: 'Send a welcome email when a user scans your QR code for the first time',
    category: 'Email',
    definition: {
      nodes: [
        { id: '1', type: 'trigger', data: { label: 'QR Scan' }, position: { x: 100, y: 100 } },
        { id: '2', type: 'condition', data: { label: 'First Time Scan?' }, position: { x: 100, y: 200 } },
        { id: '3', type: 'action', data: { label: 'Send Welcome Email', actionType: 'send-email' }, position: { x: 100, y: 300 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
      ],
    },
    trigger: { type: 'qr-scan', config: {} },
    tags: ['email', 'welcome', 'onboarding'],
  },
  {
    id: 'lead-capture',
    name: 'Lead Capture to CRM',
    description: 'Capture lead information from QR scan and add to your CRM',
    category: 'Sales',
    definition: {
      nodes: [
        { id: '1', type: 'trigger', data: { label: 'QR Scan' }, position: { x: 100, y: 100 } },
        { id: '2', type: 'transform', data: { label: 'Extract Lead Data' }, position: { x: 100, y: 200 } },
        { id: '3', type: 'action', data: { label: 'Add to CRM', actionType: 'send-webhook' }, position: { x: 100, y: 300 } },
        { id: '4', type: 'action', data: { label: 'Send Follow-up Email', actionType: 'send-email' }, position: { x: 100, y: 400 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
      ],
    },
    trigger: { type: 'qr-scan', config: {} },
    tags: ['crm', 'lead', 'sales'],
  },
  {
    id: 'inventory-alert',
    name: 'Low Inventory Alert',
    description: 'Get notified when product scans indicate low inventory',
    category: 'Inventory',
    definition: {
      nodes: [
        { id: '1', type: 'trigger', data: { label: 'Database Event' }, position: { x: 100, y: 100 } },
        { id: '2', type: 'condition', data: { label: 'Inventory < 10?' }, position: { x: 100, y: 200 } },
        { id: '3', type: 'action', data: { label: 'Send Alert', actionType: 'send-notification' }, position: { x: 100, y: 300 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
      ],
    },
    trigger: { type: 'database-event', config: { table: 'products', event: 'update' } },
    tags: ['inventory', 'alert', 'automation'],
  },
  {
    id: 'scheduled-report',
    name: 'Weekly Analytics Report',
    description: 'Send weekly scan analytics report via email',
    category: 'Analytics',
    definition: {
      nodes: [
        { id: '1', type: 'trigger', data: { label: 'Weekly Schedule' }, position: { x: 100, y: 100 } },
        { id: '2', type: 'action', data: { label: 'Fetch Analytics', actionType: 'run-script' }, position: { x: 100, y: 200 } },
        { id: '3', type: 'transform', data: { label: 'Format Report' }, position: { x: 100, y: 300 } },
        { id: '4', type: 'action', data: { label: 'Send Email', actionType: 'send-email' }, position: { x: 100, y: 400 } },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
      ],
    },
    trigger: { type: 'schedule', config: { schedule: '0 9 * * 1', timezone: 'America/New_York' } },
    tags: ['analytics', 'report', 'scheduled'],
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function createEmptyWorkflow(): CreateWorkflowInput {
  return {
    name: 'New Workflow',
    description: '',
    definition: {
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          data: { label: 'Trigger' },
          position: { x: 250, y: 50 },
        },
      ],
      edges: [],
    },
    trigger: {
      type: 'manual',
      config: {},
    },
  };
}

export function validateWorkflow(workflow: WorkflowDefinition): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for at least one trigger
  const triggers = workflow.nodes.filter(n => n.type === 'trigger');
  if (triggers.length === 0) {
    errors.push('Workflow must have at least one trigger');
  }
  
  // Check for orphan nodes (not connected)
  const connectedNodeIds = new Set([
    ...workflow.edges.map(e => e.source),
    ...workflow.edges.map(e => e.target),
  ]);
  
  workflow.nodes.forEach(node => {
    if (node.type !== 'trigger' && !connectedNodeIds.has(node.id)) {
      errors.push(`Node "${node.data.label}" is not connected to the workflow`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================
// COMBINED EXPORT
// ============================================================

export const workflowApi = {
  workflows: workflowsApi,
  runs: runsApi,
  templates: workflowTemplatesApi,
  
  // Utilities
  createEmptyWorkflow,
  validateWorkflow,
  WORKFLOW_PRESETS,
};

export default workflowApi;
