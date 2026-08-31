export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceData {
  slug: string;
  name: string;
  shortDescription: string;
  metaDescription: string;
  heroSubhead: string;
  problem: string;
  solution: string;
  deliverables: string[];
  process: { title: string; description: string }[];
  stack: string[];
  outcomes: string[];
  faqs: ServiceFaq[];
  fromPrice: string;
  relatedSlugs: string[];
}

export const services: ServiceData[] = [
  {
    slug: 'power-bi-data-analytics',
    name: 'Power BI & Data Analytics',
    shortDescription: 'Dashboards and reporting that turn scattered spreadsheets into decisions your team can act on weekly.',
    metaDescription:
      'Power BI consulting for Nigerian businesses in Abuja and beyond — dashboards, data models, and automated reporting that replace manual spreadsheet work.',
    heroSubhead:
      'Stop rebuilding the same report every month. I build Power BI dashboards that update themselves and answer the questions your leadership actually asks.',
    problem:
      'Most Nigerian SMEs and institutions run on spreadsheets that someone rebuilds by hand every week. Numbers live in different files, sales data disagrees with finance data, and by the time a report reaches management it is already out of date. Decisions get made on gut feel because the data takes too long to trust.',
    solution:
      'I connect your existing data sources — Excel, SQL databases, POS exports, Google Sheets, accounting software — into a single Power BI model, clean the data once, and build dashboards that refresh on a schedule. You get one number for revenue, one number for stock, one number for performance, and everyone looks at the same version of the truth.',
    deliverables: [
      'Data audit and source mapping (what you have, where it lives, what is missing)',
      'Cleaned and modelled dataset in Power BI (or Excel Power Query where Power BI is not yet needed)',
      'Interactive dashboards for sales, operations, or finance — built around the decisions you actually make',
      'Scheduled data refresh so numbers stay current without manual re-uploading',
      'A short training session so your team can filter, drill down, and export without calling me every time',
      'Documentation of the data model for future handover or in-house maintenance',
    ],
    process: [
      { title: 'Discovery call', description: 'We walk through what you currently track, in what tools, and which decisions the reporting needs to support.' },
      { title: 'Data audit & modelling', description: 'I map your data sources, clean inconsistencies, and build a data model that scales as you add more.' },
      { title: 'Dashboard build', description: 'I design and build the dashboards, iterating with you on what to show first and what can move to a drill-down view.' },
      { title: 'Handover & training', description: 'You get a walkthrough session, a short reference guide, and a refresh schedule that keeps the data current.' },
    ],
    stack: ['Power BI', 'Power Query / M', 'DAX', 'SQL', 'Excel & VBA', 'Python (for heavier data prep)'],
    outcomes: [
      'Weekly reporting that used to take a full day compressed into a live dashboard refreshed automatically',
      'One shared source of truth across sales, operations, and finance instead of three conflicting spreadsheets',
      'Leadership able to drill from a company-wide number down to a single branch or product line in seconds',
    ],
    faqs: [
      {
        question: 'Do we need to already use Power BI?',
        answer:
          'No. Most clients start with Excel or raw exports from a POS or accounting system. Part of the engagement is deciding whether Power BI, an upgraded Excel workbook, or a lightweight custom dashboard is the right fit for your budget and team.',
      },
      {
        question: 'Can you work with our existing accounting or POS software?',
        answer:
          'In most cases, yes. I connect to common export formats and databases directly. If your system has no export option at all, we discuss a workaround during the discovery call before any commitment.',
      },
      {
        question: 'How long does a typical dashboard project take?',
        answer:
          'A focused single-department dashboard usually takes two to three weeks from discovery to handover. Multi-source, company-wide reporting takes longer — I give you a specific timeline after the data audit.',
      },
      {
        question: 'What happens after the dashboard is delivered?',
        answer:
          'You own the dashboard and the data model. I offer optional monthly support for teams that want ongoing changes, new metrics, or troubleshooting without hiring in-house.',
      },
    ],
    fromPrice: '₦350,000',
    relatedSlugs: ['business-automation', 'custom-software-development'],
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    shortDescription: 'Fast, conversion-focused websites built on Next.js — or WordPress where that is genuinely the better fit.',
    metaDescription:
      'Web development services in Abuja, Nigeria — conversion-focused business websites built with Next.js, optimised for speed, SEO, and mobile visitors.',
    heroSubhead:
      'A website that loads fast, ranks on Google, and makes it obvious what to do next — built for how your customers actually browse.',
    problem:
      'A lot of business websites in Nigeria load slowly on mobile data, bury the phone number and WhatsApp link three clicks deep, and were never structured for search engines to understand what the business actually does. Visitors leave before the page finishes loading, and the site brings in almost no organic traffic.',
    solution:
      'I build websites on modern, fast frameworks (Next.js by default, WordPress when a client specifically needs an in-house content team editing pages daily), with SEO structure built in from the first page — not bolted on afterward. Every site is mobile-first, since most Nigerian traffic is mobile, and every page has one clear next action for the visitor.',
    deliverables: [
      'Custom-designed, mobile-first website matched to your brand',
      'On-page SEO: metadata, heading structure, sitemap, schema markup',
      'Fast page loads (optimised images, minimal unnecessary JavaScript)',
      'Contact/lead forms wired to your email or CRM',
      'Basic analytics setup so you can see where visitors come from',
      'A short handover guide for making simple content edits yourself',
    ],
    process: [
      { title: 'Scope & sitemap', description: 'We agree the pages you need, the primary action for each, and the content you already have versus what needs writing.' },
      { title: 'Design', description: 'I design key pages first for your sign-off before building the rest, so there are no surprises at the end.' },
      { title: 'Build', description: 'I build the site with performance and SEO structure in from day one, not retrofitted later.' },
      { title: 'Launch & handover', description: 'Domain, hosting, and analytics are connected, and I walk you through making simple edits yourself.' },
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'WordPress (where appropriate)', 'Vercel / cPanel hosting'],
    outcomes: [
      'Pages that load in under two seconds on typical Nigerian mobile connections',
      'Clear paths to a phone call, WhatsApp message, or contact form on every page',
      'A structure search engines can actually index and rank',
    ],
    faqs: [
      {
        question: 'Next.js or WordPress — how do you decide?',
        answer:
          'If your team needs to publish blog posts or edit pages constantly without a developer, WordPress is often the practical choice. If speed, custom functionality, or a lean marketing site matter more, Next.js is usually the better fit. I recommend based on your team, not a fixed preference.',
      },
      {
        question: 'Will the website work well on slow mobile data?',
        answer:
          'Yes — performance is treated as a requirement, not an afterthought. Images are optimised, unnecessary scripts are avoided, and pages are built to render quickly even on 3G/4G connections.',
      },
      {
        question: 'Do you also handle hosting and the domain?',
        answer:
          'I can set these up and connect them for you, or work with your existing hosting/domain provider if you already have one.',
      },
      {
        question: 'Can I update the website content myself later?',
        answer:
          'Yes. For WordPress builds this is native. For Next.js builds, I set up a simple content structure (or a headless CMS if you need frequent updates) and walk you through it at handover.',
      },
    ],
    fromPrice: '₦450,000',
    relatedSlugs: ['custom-software-development', 'power-bi-data-analytics'],
  },
  {
    slug: 'custom-software-development',
    name: 'Custom Software Development',
    shortDescription: 'Web applications built around your actual workflow, when off-the-shelf software almost fits but not quite.',
    metaDescription:
      'Custom software development for Nigerian businesses — web applications, internal tools, and systems built around your workflow when off-the-shelf software falls short.',
    heroSubhead:
      "When the software almost fits but forces your team to work around it, it's usually cheaper to build the piece you actually need.",
    problem:
      'Off-the-shelf software is built for a generic business, not yours. Teams end up maintaining parallel spreadsheets to cover what the software cannot do, or paying for modules they never use while still missing the one feature that matters. Multiple disconnected tools mean data gets re-entered by hand and mistakes creep in.',
    solution:
      'I design and build web applications scoped tightly around the workflow you actually run — whether that is a staff management tool, a custom booking system, an internal approvals tool, or something specific to your operations. The goal is always software that removes manual work, not software that impresses on paper but adds new work.',
    deliverables: [
      'A scoped requirements document before any code is written, so cost and timeline are clear upfront',
      'A working web application matched to your workflow, not a generic template',
      'User roles and permissions appropriate to your team structure',
      'Database design that can grow with your business',
      'Deployment to reliable hosting, with a handover walkthrough',
      'Documentation so future changes do not depend on tribal knowledge',
    ],
    process: [
      { title: 'Requirements workshop', description: 'We map your current workflow, the gaps in existing tools, and what "done" looks like for the first version.' },
      { title: 'Technical design', description: 'I design the data model and system architecture and confirm scope and cost before development starts.' },
      { title: 'Build in stages', description: 'Development happens in reviewable stages so you see progress and can redirect early rather than at the end.' },
      { title: 'Testing & handover', description: 'The system is tested against real scenarios from your business, then deployed with training for your team.' },
    ],
    stack: ['React / Next.js', 'Node.js', 'PostgreSQL / MySQL', 'Python (for data-heavy tools)', 'REST & webhook integrations'],
    outcomes: [
      'A single internal tool replacing three or four disconnected spreadsheets and manual processes',
      'Fewer data entry errors because information is entered once, not copied between tools',
      'A system your team actually uses because it was built around how they already work',
    ],
    faqs: [
      {
        question: 'How is this different from just buying existing software?',
        answer:
          "If an existing product genuinely covers your needs, I'll tell you that directly rather than build something unnecessary. Custom development makes sense when your workflow does not map cleanly onto what's available, or when licensing costs for the features you need are disproportionate.",
      },
      {
        question: 'What if my requirements change partway through?',
        answer:
          'Some change is normal once you see the system taking shape. Building in stages means we catch this early and adjust scope and cost transparently rather than discovering it at final delivery.',
      },
      {
        question: 'Do you provide support after launch?',
        answer:
          'Yes, on a retainer or ad-hoc basis depending on how much ongoing change you expect. This is agreed before the project starts, not added as a surprise afterward.',
      },
      {
        question: 'Can this integrate with tools we already use?',
        answer:
          'In most cases yes, through APIs, webhooks, or scheduled data syncs. We confirm feasibility for your specific tools during the requirements workshop.',
      },
    ],
    fromPrice: '₦900,000',
    relatedSlugs: ['business-automation', 'inventory-pos-systems'],
  },
  {
    slug: 'business-automation',
    name: 'Business & Workflow Automation',
    shortDescription: 'Remove repetitive manual work between the tools you already use — without a full software rebuild.',
    metaDescription:
      'Business process automation for Nigerian companies — connect your existing tools, remove repetitive manual tasks, and cut down on data entry errors.',
    heroSubhead:
      'If someone on your team copies data between two systems every day, that is usually an afternoon of automation waiting to happen.',
    problem:
      'A lot of operational time in growing businesses goes into repetitive, low-value work: copying leads from a form into a spreadsheet, manually sending the same follow-up messages, re-entering orders from WhatsApp into an inventory system, or generating the same report every Monday morning by hand. It rarely feels urgent enough to fix, so it just continues.',
    solution:
      'I map the repetitive steps in your operations and automate them using workflow tools and light custom scripting — connecting forms, spreadsheets, WhatsApp, email, and internal systems so information moves on its own. Automation is scoped to save real hours, not to add complexity for its own sake.',
    deliverables: [
      'A process audit identifying the highest-impact automation opportunities',
      'Automated workflows connecting your existing tools (forms, sheets, email, WhatsApp, CRM, etc.)',
      'Error handling and notifications so failures are caught, not silent',
      'Documentation of each workflow so your team understands what runs automatically and why',
      'Handover session covering how to pause, adjust, or extend the automations',
    ],
    process: [
      { title: 'Process audit', description: 'We identify the repetitive tasks costing the most time and the tools currently involved in each.' },
      { title: 'Automation design', description: 'I design the workflow logic, including what happens when something goes wrong, before building.' },
      { title: 'Build & test', description: 'Each automation is tested against real data before going live, not just a clean demo scenario.' },
      { title: 'Monitor & refine', description: 'After launch, we check the automation is behaving as expected and adjust based on real usage.' },
    ],
    stack: ['n8n', 'Zapier / Make (where appropriate)', 'Google Sheets & Workspace APIs', 'WhatsApp Business API', 'Python scripting'],
    outcomes: [
      'Hours per week returned to staff previously spent on manual data entry',
      'Fewer errors from manual copy-paste between systems',
      'Faster response times on leads and customer messages because the first step happens automatically',
    ],
    faqs: [
      {
        question: 'Do we need to replace our current tools?',
        answer:
          'Usually not. Automation typically connects the tools you already use rather than replacing them, which keeps cost and disruption low.',
      },
      {
        question: 'What if the automation breaks or a connected tool changes?',
        answer:
          'Workflows are built with error notifications so you know immediately if something stops working, rather than finding out days later. Ongoing monitoring can be arranged as part of a support retainer.',
      },
      {
        question: 'How much time can automation realistically save?',
        answer:
          'It depends entirely on the process. Part of the initial audit is estimating realistic time savings before you commit, so you know the expected return before any work begins.',
      },
    ],
    fromPrice: '₦250,000',
    relatedSlugs: ['power-bi-data-analytics', 'custom-software-development'],
  },
  {
    slug: 'inventory-pos-systems',
    name: 'Inventory & POS Systems',
    shortDescription: 'Stock and sales tracking built for how Nigerian retail and distribution businesses actually operate.',
    metaDescription:
      'Inventory management and POS systems for Nigerian retail and distribution businesses in Abuja — stock tracking, sales recording, and low-stock alerts.',
    heroSubhead:
      'Know what is in stock, what sold today, and what needs reordering — without a notebook, three spreadsheets, and a guess.',
    problem:
      'Many retail and distribution businesses in Nigeria still track stock on paper or in spreadsheets that fall out of date the moment a sale happens outside the till. Stock discrepancies go unnoticed until a full count, popular items run out without warning, and sales data is too scattered to show which products actually drive profit.',
    solution:
      'I build and configure inventory and point-of-sale systems sized to your business — from a lean stock-and-sales tracker for a single store to a multi-branch system with role-based staff access. The focus is accurate real-time stock levels, simple sales recording, and reporting that shows what is actually moving.',
    deliverables: [
      'Inventory system configured around your product catalogue and stock structure',
      'Point-of-sale recording for daily transactions, matched to how staff actually sell',
      'Low-stock alerts so reordering happens before you run out, not after',
      'Sales and stock reports by product, category, or branch',
      'Staff accounts with appropriate access levels',
      'Training for staff who will use the system daily',
    ],
    process: [
      { title: 'Operations walkthrough', description: 'I review how stock currently moves through your business — receiving, sales, transfers, returns — to size the system correctly.' },
      { title: 'Configuration or build', description: 'Depending on scale, I configure an existing platform or build a custom system, matched to your catalogue and branch structure.' },
      { title: 'Data migration', description: 'Existing stock records are imported so you start with accurate numbers on day one, not a blank system.' },
      { title: 'Staff training & go-live', description: 'Staff are trained on daily use before go-live, with support available during the first weeks of real transactions.' },
    ],
    stack: ['Custom web application (React/Next.js + database)', 'Barcode/SKU support where needed', 'Role-based access control', 'Reporting dashboards'],
    outcomes: [
      'Real-time stock counts instead of end-of-month reconciliation surprises',
      'Reordering triggered by actual low-stock alerts rather than staff memory',
      'Clear visibility into which products drive the most profit, by branch where relevant',
    ],
    faqs: [
      {
        question: 'Is this a ready-made product or built for my business specifically?',
        answer:
          'It depends on your scale and needs. For straightforward single-store operations, a configured lean system is often the fastest and most cost-effective route. For multi-branch or unusual workflows, a more tailored build makes more sense. This is discussed honestly during the operations walkthrough — you get whichever is the better fit, not whichever is more billable.',
      },
      {
        question: 'Can it work with barcode scanners or existing hardware?',
        answer:
          'Yes, where your hardware supports standard barcode/SKU scanning. We confirm compatibility with your specific equipment before the project is scoped.',
      },
      {
        question: 'What happens to our existing stock records?',
        answer:
          'Existing records are migrated into the new system as part of setup, so you are not starting from zero on launch day.',
      },
      {
        question: 'Does it support multiple branches or locations?',
        answer:
          'Yes — multi-branch stock visibility and reporting is a common requirement and is scoped in from the start for businesses that need it.',
      },
    ],
    fromPrice: '₦600,000',
    relatedSlugs: ['custom-software-development', 'business-automation'],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
