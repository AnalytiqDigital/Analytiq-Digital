export type PortfolioCategory = 'Websites' | 'Software' | 'AI' | 'Analytics' | 'Automation';

export interface PortfolioItem {
  slug: string;
  title: string;
  category: PortfolioCategory;
  description: string;
  technologies: string[];
  projectUrl?: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    slug: 'inventory-management-system',
    title: 'Inventory Management System',
    category: 'Software',
    description:
      'A multi-branch inventory system giving real-time stock visibility and automated low-stock alerts for a distribution business.',
    technologies: ['React / Next.js', 'PostgreSQL', 'Role-based access control'],
  },
  {
    slug: 'ai-powered-restaurant-ordering-system',
    title: 'AI-Powered Restaurant Ordering System',
    category: 'AI',
    description:
      'An AI-assisted ordering flow that captures multi-item orders accurately and routes them straight to the kitchen.',
    technologies: ['n8n', 'LLM APIs', 'Google Sheets', 'WhatsApp Business API'],
  },
  {
    slug: 'hospital-wellness-analytics-dashboard',
    title: 'Hospital Wellness Analytics Dashboard',
    category: 'Analytics',
    description:
      'A Power BI dashboard consolidating patient wellness and operational metrics into a single, decision-ready view.',
    technologies: ['Power BI', 'Power Query', 'DAX'],
  },
  {
    slug: 'school-management-portal',
    title: 'School Management Portal',
    category: 'Software',
    description:
      'A student records, attendance, and fee-tracking portal replacing paper registers and disconnected spreadsheets.',
    technologies: ['React / Next.js', 'PostgreSQL'],
  },
  {
    slug: 'business-intelligence-dashboard',
    title: 'Business Intelligence Dashboard',
    category: 'Analytics',
    description:
      'A company-wide Power BI dashboard consolidating multi-site performance data into one daily-refreshed view.',
    technologies: ['Power BI', 'Power Query', 'Excel'],
  },
  {
    slug: 'custom-corporate-website',
    title: 'Custom Corporate Website',
    category: 'Websites',
    description:
      'A fast, SEO-structured corporate website built to convert visitors into qualified enquiries.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
];

export function getPortfolioItemBySlug(slug: string) {
  return portfolioItems.find((p) => p.slug === slug);
}

export const portfolioCategories: PortfolioCategory[] = ['Websites', 'Software', 'AI', 'Analytics', 'Automation'];
