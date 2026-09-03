export interface Solution {
  slug: string;
  name: string;
  description: string;
  features: string[];
  icon: string;
}

export const solutions: Solution[] = [
  {
    slug: 'cloud-pos',
    name: 'Cloud POS',
    description:
      'A point-of-sale system your team can run from any branch, with sales syncing to a central dashboard in real time.',
    features: ['Multi-branch sales recording', 'Real-time sync to head office', 'Works on standard tablets/PCs', 'Daily sales summaries'],
    icon: 'credit-card',
  },
  {
    slug: 'inventory-management-system',
    name: 'Inventory Management System',
    description:
      'Real-time stock visibility with low-stock alerts, sized for a single store or a multi-branch operation.',
    features: ['Real-time stock counts', 'Automated low-stock alerts', 'Multi-branch support', 'Stock movement reporting'],
    icon: 'package',
  },
  {
    slug: 'crm-platform',
    name: 'CRM Platform',
    description:
      'Track leads and customers through your sales pipeline instead of losing them in scattered notes and chats.',
    features: ['Lead & contact tracking', 'Pipeline / stage management', 'Follow-up reminders', 'Team assignment'],
    icon: 'users',
  },
  {
    slug: 'business-reporting-dashboard',
    name: 'Business Reporting Dashboard',
    description:
      'A live view of the numbers that matter — sales, operations, or finance — refreshed automatically instead of rebuilt by hand.',
    features: ['Power BI or custom dashboard', 'Scheduled auto-refresh', 'Drill-down by branch or product', 'Role-based access'],
    icon: 'bar-chart',
  },
  {
    slug: 'restaurant-ordering-system',
    name: 'Restaurant Ordering System',
    description:
      'AI-assisted ordering that captures orders accurately, whether they arrive via WhatsApp, in person, or online.',
    features: ['Menu & order management', 'AI-assisted order capture', 'Kitchen order routing', 'Sales reporting'],
    icon: 'utensils',
  },
  {
    slug: 'school-management-portal',
    name: 'School Management Portal',
    description:
      'A single system for student records, attendance, and fee tracking, replacing scattered registers and spreadsheets.',
    features: ['Student records & attendance', 'Fee tracking', 'Staff & class management', 'Parent-facing reporting'],
    icon: 'graduation-cap',
  },
  {
    slug: 'custom-business-applications',
    name: 'Custom Business Applications',
    description:
      "For operations that don't fit a template — a tailored application built around your specific workflow.",
    features: ['Scoped to your exact workflow', 'Role-based access', 'Built to integrate with existing tools', 'Documented and handed over'],
    icon: 'layout-grid',
  },
];
