export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  industry: string;
  serviceSlug: string;
  summary: string;
  metaDescription: string;
  challenge: string;
  approach: string;
  solution: string;
  results: string[];
  tech: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'inventory-management-system',
    title: 'Inventory Management System',
    client: 'A distribution and wholesale business operating multiple branches',
    industry: 'Distribution / Wholesale',
    serviceSlug: 'custom-software',
    summary:
      'Replaced paper-based stock tracking across branches with a real-time inventory system and automated low-stock alerts.',
    metaDescription:
      'Case study: a custom multi-branch inventory management system with real-time stock visibility and automated low-stock alerts for a Nigerian distribution business.',
    challenge:
      'Stock was tracked on paper at each branch, with physical counts reconciled centrally only once a month. Popular items regularly ran out between counts because no one had visibility into stock levels across branches in real time, and reordering was based on staff memory rather than data.',
    approach:
      'We reviewed how stock actually moved through the business — receiving, inter-branch transfers, sales, and returns — before designing the system, since the paper process had informal workarounds that a rigid off-the-shelf system would have broken. The system was then built around that real workflow rather than a generic retail template.',
    solution:
      'A custom web-based inventory management system now gives real-time stock visibility across all branches, with automated low-stock alerts sent to the relevant branch manager and head office before an item runs out. Historical stock data was migrated in during setup so the business started with accurate numbers, not a blank slate.',
    results: [
      'Stock-outs on popular items reduced significantly through automated low-stock alerts',
      'Head office gained real-time visibility across branches instead of a monthly reconciled snapshot',
      'Inter-branch stock transfers became trackable instead of informal and undocumented',
    ],
    tech: ['React/Next.js', 'PostgreSQL', 'Role-based access control', 'Automated alerting'],
  },
  {
    slug: 'ai-powered-restaurant-ordering-system',
    title: 'AI-Powered Restaurant Ordering System',
    client: 'A multi-location restaurant business',
    industry: 'Hospitality / Food Service',
    serviceSlug: 'ai-whatsapp-assistant',
    summary:
      'Automated order capture from WhatsApp and in-person channels, routing accurate multi-item orders straight to the kitchen.',
    metaDescription:
      'Case study: an AI-powered restaurant ordering system automating multi-item order capture and kitchen routing for a Nigerian hospitality business.',
    challenge:
      'Orders arrived through multiple channels — WhatsApp messages, phone calls, and in-person — and staff manually re-entered each one into the kitchen queue. Multi-item orders with modifications were frequently miswritten under pressure during busy periods, leading to kitchen errors and delayed service.',
    approach:
      'We mapped the actual structure of a typical order — items, quantities, modifications, delivery vs. pickup — and built an AI-assisted intake flow around real order patterns and phrasing customers actually use, rather than a rigid keyword-based bot that would break on natural language.',
    solution:
      'The AI ordering assistant now handles WhatsApp order intake directly, confirms multi-item orders with the customer before submission, and routes structured orders straight to the kitchen queue, with a clear handoff to staff for anything unusual or outside its scope.',
    results: [
      'Kitchen order errors from manual re-entry reduced significantly',
      'Multi-item WhatsApp orders processed correctly without staff re-transcription',
      'Order intake continued to function during peak periods without adding staff',
    ],
    tech: ['n8n', 'LLM APIs', 'WhatsApp Business API', 'Google Sheets'],
  },
  {
    slug: 'hospital-wellness-analytics-dashboard',
    title: 'Hospital Wellness Analytics Dashboard',
    client: 'A private healthcare facility in Abuja (name withheld by client request)',
    industry: 'Healthcare',
    serviceSlug: 'power-bi-dashboards',
    summary:
      'Consolidated patient wellness and operational metrics into a single Power BI dashboard for facility management.',
    metaDescription:
      'Case study: a Power BI wellness analytics dashboard consolidating patient and operational metrics for a private healthcare facility in Abuja.',
    challenge:
      'Patient wellness indicators and day-to-day operational metrics (bed occupancy, visit volumes, follow-up adherence) were tracked in separate systems and spreadsheets, with no single view for facility management to monitor overall performance or spot emerging issues early.',
    approach:
      'We worked within the facility\'s existing data-handling and privacy constraints from the outset, aggregating and anonymising metrics at the level appropriate for management reporting rather than exposing individual patient-level data on the dashboard.',
    solution:
      'A Power BI dashboard now gives facility management a consolidated, refreshed view of key operational and aggregate wellness metrics, with drill-down by department, replacing the previous manual compilation from separate spreadsheets.',
    results: [
      'Facility-wide reporting consolidated into a single refreshed dashboard instead of separate spreadsheets',
      'Management gained department-level drill-down not previously possible',
      'Reporting turnaround for monthly management review reduced substantially',
    ],
    tech: ['Power BI', 'Power Query', 'DAX'],
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
