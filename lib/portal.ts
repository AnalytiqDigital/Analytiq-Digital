import { formatPortalAmount, isPaystackCurrency } from '@/db/schema-portal';

export { formatPortalAmount, isPaystackCurrency };

export const PROJECT_STATUSES = ['Discovery', 'In Progress', 'Review', 'Completed', 'On Hold'] as const;
export const MILESTONE_STATUSES = ['pending', 'in_progress', 'completed'] as const;
export const INVOICE_STATUSES = ['draft', 'sent', 'partial', 'paid', 'overdue', 'cancelled'] as const;
export const RENEWAL_STATUSES = ['upcoming', 'due', 'renewed', 'expired'] as const;

export const projectStatusColors: Record<string, string> = {
  Discovery: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Review: 'bg-purple-100 text-purple-700',
  Completed: 'bg-green-100 text-green-700',
  'On Hold': 'bg-slate-200 text-slate-600',
};

export const invoiceStatusColors: Record<string, string> = {
  draft: 'bg-slate-200 text-slate-600',
  sent: 'bg-blue-100 text-blue-700',
  partial: 'bg-amber-100 text-amber-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-200 text-slate-600',
};

export const milestoneStatusColors: Record<string, string> = {
  pending: 'bg-slate-200 text-slate-600',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
};
