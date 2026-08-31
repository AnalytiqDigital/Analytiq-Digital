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
    slug: 'oil-and-gas-performance-dashboard',
    title: 'Consolidating multi-site performance reporting for an oil & gas service provider',
    client: 'A mid-size oil & gas services company (name withheld by client request)',
    industry: 'Oil & Gas Services',
    serviceSlug: 'power-bi-data-analytics',
    summary:
      'Replaced a manual, multi-day monthly reporting cycle across field sites with a live Power BI dashboard refreshed daily.',
    metaDescription:
      'Case study: how a Power BI dashboard replaced a manual multi-day reporting cycle for an oil & gas services company operating across multiple field sites.',
    challenge:
      'The client operated across several field sites, each sending performance and equipment-utilisation figures back to head office in separate spreadsheets, on different schedules, in different formats. Compiling a single monthly performance report took a finance analyst several days, and by the time it reached leadership, the underlying numbers were already three to four weeks old.',
    approach:
      'I started with a data audit across all sites to understand what was actually being tracked, in what format, and where the inconsistencies came from. Rather than trying to force every site onto new software immediately, I built a standardised intake template each site could keep using with minimal disruption, then built the transformation and modelling layer in Power Query to reconcile the differences automatically.',
    solution:
      'The result was a Power BI dashboard consolidating equipment utilisation, site performance, and cost figures across all locations, refreshed on a daily schedule rather than compiled by hand. Leadership could drill from a company-wide utilisation figure down to an individual site or asset without waiting on the finance team, and site-level anomalies became visible within a day instead of a month.',
    results: [
      'Monthly reporting compilation time reduced from several days to effectively zero — the dashboard refreshes automatically',
      'Leadership visibility into site performance moved from a monthly lag to daily',
      'Site-level anomalies (underutilised equipment, cost overruns) surfaced within a day of occurring instead of at month-end',
    ],
    tech: ['Power BI', 'Power Query', 'DAX', 'Excel (standardised site intake templates)'],
  },
  {
    slug: 'sme-sales-analytics-turnaround',
    title: 'Turning three years of disconnected sales spreadsheets into one dashboard for an Abuja retail SME',
    client: 'A multi-branch retail business in Abuja',
    industry: 'Retail',
    serviceSlug: 'power-bi-data-analytics',
    summary:
      'Unified three branches worth of sales spreadsheets into a single Power BI model, revealing which products actually drove profit.',
    metaDescription:
      'Case study: how a retail SME in Abuja moved from disconnected branch spreadsheets to a single Power BI sales dashboard revealing true product profitability.',
    challenge:
      "The business ran three branches, each keeping its own sales spreadsheet with slightly different structures and product naming. Leadership knew total revenue, but could not confidently answer which products or branches actually drove profit, because margin data lived in a separate file that was rarely reconciled with sales volume.",
    approach:
      'I consolidated three years of historical spreadsheets into a consistent product taxonomy, then linked sales volume data with the separate cost/margin records so profitability could be calculated per product, not just per sale. This groundwork mattered more than the dashboard itself — most of the early effort went into cleaning and reconciling naming inconsistencies across branches.',
    solution:
      'The finished dashboard let the owner filter by branch, category, or individual product and see revenue against actual margin, not just top-line sales. A slow-moving-stock view was added so purchasing decisions could be based on what was actually selling, branch by branch.',
    results: [
      'Identified that a subset of high-revenue products were, after accounting for true margin, contributing far less profit than assumed',
      'Purchasing decisions shifted from gut feel to a weekly review of the slow-moving-stock view',
      'Branch performance became directly comparable for the first time using a shared product taxonomy',
    ],
    tech: ['Power BI', 'Power Query', 'Excel', 'DAX'],
  },
  {
    slug: 'institutional-workflow-automation',
    title: 'Automating manual data entry for an institutional client’s intake process',
    client: 'A public-sector-adjacent institution in Abuja (name withheld by client request)',
    industry: 'Institutional / Public Sector',
    serviceSlug: 'business-automation',
    summary:
      'Automated a manual form-to-spreadsheet intake process, cutting a multi-day backlog down to near real-time processing.',
    metaDescription:
      'Case study: automating a manual intake process for an institutional client in Abuja, reducing a multi-day processing backlog to near real time.',
    challenge:
      'Applications submitted through a web form were being manually copied into a tracking spreadsheet by staff, then routed by email for review. During busy periods, the manual copying step alone created a backlog of several days before an application was even seen by a reviewer.',
    approach:
      'I mapped the full path an application took from submission to decision, and identified that the manual copy-paste step and the email-based routing were the two biggest bottlenecks. Rather than replacing the existing form or review process, I automated the connective steps between them.',
    solution:
      'Using workflow automation, submissions now flow directly from the form into the tracking system with structured data intact, and are automatically routed to the correct reviewer queue based on application type, with status notifications sent automatically at each stage.',
    results: [
      'Processing backlog reduced from several days to near real-time intake',
      'Manual data entry errors from copy-paste eliminated for the intake step',
      'Reviewers gained automatic status notifications instead of relying on manual email follow-up',
    ],
    tech: ['n8n', 'Google Sheets / Workspace APIs', 'Webhook-based form integration'],
  },
  {
    slug: 'multibranch-inventory-system',
    title: 'Building a multi-branch inventory and stock alert system for a distribution business',
    client: 'A distribution and wholesale business operating multiple branches',
    industry: 'Distribution / Wholesale',
    serviceSlug: 'inventory-pos-systems',
    summary:
      'Replaced paper-based stock tracking across branches with a real-time inventory system and automated low-stock alerts.',
    metaDescription:
      'Case study: a custom multi-branch inventory system with real-time stock visibility and automated low-stock alerts for a Nigerian distribution business.',
    challenge:
      'Stock was tracked on paper at each branch, with physical counts reconciled centrally only once a month. Popular items regularly ran out between counts because no one had visibility into stock levels across branches in real time, and reordering was based on staff memory rather than data.',
    approach:
      'I reviewed how stock actually moved through the business — receiving, inter-branch transfers, sales, and returns — before designing the system, since the paper process had informal workarounds that a rigid off-the-shelf system would have broken. The system was then built around that real workflow rather than a generic retail template.',
    solution:
      'A custom web-based inventory system now gives real-time stock visibility across all branches, with automated low-stock alerts sent to the relevant branch manager and head office before an item runs out. Historical stock data was migrated in during setup so the business started with accurate numbers, not a blank slate.',
    results: [
      'Stock-outs on popular items reduced significantly through automated low-stock alerts',
      'Head office gained real-time visibility across branches instead of a monthly reconciled snapshot',
      'Inter-branch stock transfers became trackable instead of informal and undocumented',
    ],
    tech: ['React/Next.js', 'PostgreSQL', 'Role-based access control', 'Automated alerting'],
  },
];

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
