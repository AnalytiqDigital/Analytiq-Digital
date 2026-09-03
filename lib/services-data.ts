export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceData {
  slug: string;
  name: string;
  icon: string; // simple key used to pick an icon in ServiceCard
  shortDescription: string;
  metaDescription: string;
  heroSubhead: string;
  problem: string;
  solution: string;
  benefits: string[];
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
    slug: 'website-development',
    name: 'Website Development',
    icon: 'globe',
    shortDescription: 'Modern, responsive and conversion-focused websites for businesses and organizations.',
    metaDescription:
      'Website development services in Abuja, Nigeria — modern, responsive, conversion-focused websites built on Next.js, optimised for speed and SEO.',
    heroSubhead:
      'A website that loads fast, ranks on Google, and makes it obvious what to do next — built for how your customers actually browse.',
    problem:
      'A lot of business websites in Nigeria load slowly on mobile data, bury the phone number and WhatsApp link three clicks deep, and were never structured for search engines to understand what the business actually does. Visitors leave before the page finishes loading, and the site brings in almost no organic traffic.',
    solution:
      'We build websites on modern, fast frameworks — Next.js by default, WordPress when a client specifically needs an in-house content team editing pages daily — with SEO structure built in from the first page, not bolted on afterward. Every site is mobile-first, since most Nigerian traffic is mobile, and every page has one clear next action for the visitor.',
    benefits: [
      'Faster load times that keep mobile visitors from bouncing',
      'A structure search engines can actually crawl and rank',
      'A clear path to a call, WhatsApp message, or form on every page',
    ],
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
      { title: 'Design', description: 'Key pages are designed first for your sign-off before we build the rest, so there are no surprises at the end.' },
      { title: 'Build', description: 'The site is built with performance and SEO structure in from day one, not retrofitted later.' },
      { title: 'Launch & handover', description: 'Domain, hosting, and analytics are connected, and we walk you through making simple edits yourself.' },
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
          'If your team needs to publish blog posts or edit pages constantly without a developer, WordPress is often the practical choice. If speed, custom functionality, or a lean marketing site matter more, Next.js is usually the better fit. We recommend based on your team, not a fixed preference.',
      },
      {
        question: 'Will the website work well on slow mobile data?',
        answer:
          'Yes — performance is treated as a requirement, not an afterthought. Images are optimised, unnecessary scripts are avoided, and pages are built to render quickly even on 3G/4G connections.',
      },
      {
        question: 'Do you also handle hosting and the domain?',
        answer: 'We can set these up and connect them for you, or work with your existing hosting/domain provider if you already have one.',
      },
      {
        question: 'Can I update the website content myself later?',
        answer:
          'Yes. For WordPress builds this is native. For Next.js builds, we set up a simple content structure (or a headless CMS if you need frequent updates) and walk you through it at handover.',
      },
    ],
    fromPrice: '₦450,000',
    relatedSlugs: ['custom-software', 'digital-consulting'],
  },
  {
    slug: 'ai-automation',
    name: 'AI Automation',
    icon: 'cpu',
    shortDescription: 'Automate repetitive business processes using AI, workflows and intelligent integrations.',
    metaDescription:
      'AI automation services for Nigerian businesses — connect your tools, automate repetitive tasks, and add AI where it genuinely saves time.',
    heroSubhead:
      'If someone on your team repeats the same task every day, there is usually an AI-assisted workflow waiting to take it off their plate.',
    problem:
      'A lot of operational time in growing businesses goes into repetitive, low-value work: sorting and responding to routine enquiries, copying information between systems, drafting the same type of message over and over, or manually triaging leads before anyone qualified sees them. It rarely feels urgent enough to fix, so it just continues.',
    solution:
      'We map the repetitive steps in your operations and automate them using workflow tools combined with AI where it adds real judgement — drafting responses, classifying enquiries, summarising documents, or routing leads — connected to the systems you already use. Automation is scoped to save real hours, not to add complexity for its own sake.',
    benefits: [
      'Hours returned to staff who were doing repetitive manual work',
      'Faster response times because the first step happens automatically',
      'AI used where it adds judgement, not as a gimmick bolted onto a workflow',
    ],
    deliverables: [
      'A process audit identifying the highest-impact automation opportunities',
      'Automated workflows connecting your existing tools (forms, sheets, email, WhatsApp, CRM, etc.)',
      'AI steps where relevant — drafting, classifying, summarising — with human review built in where it matters',
      'Error handling and notifications so failures are caught, not silent',
      'Documentation of each workflow so your team understands what runs automatically and why',
    ],
    process: [
      { title: 'Process audit', description: 'We identify the repetitive tasks costing the most time and the tools currently involved in each.' },
      { title: 'Automation design', description: 'We design the workflow logic, including where AI fits and what happens when something goes wrong, before building.' },
      { title: 'Build & test', description: 'Each automation is tested against real data before going live, not just a clean demo scenario.' },
      { title: 'Monitor & refine', description: 'After launch, we check the automation is behaving as expected and adjust based on real usage.' },
    ],
    stack: ['n8n', 'OpenAI / LLM APIs', 'Zapier / Make (where appropriate)', 'Google Workspace APIs', 'WhatsApp Business API'],
    outcomes: [
      'Hours per week returned to staff previously spent on manual, repetitive tasks',
      'Faster first-response times on enquiries and leads',
      'Fewer errors from manual copy-paste between systems',
    ],
    faqs: [
      {
        question: 'Do we need to replace our current tools?',
        answer: 'Usually not. Automation typically connects the tools you already use rather than replacing them, which keeps cost and disruption low.',
      },
      {
        question: 'Is AI reliable enough to handle this without supervision?',
        answer:
          'For anything customer-facing or decision-critical, we build in human review at the right checkpoints rather than letting AI act fully unsupervised. Where full automation is safe — internal sorting, drafting, summarising — it runs on its own.',
      },
      {
        question: 'What if the automation breaks or a connected tool changes?',
        answer: 'Workflows are built with error notifications so you know immediately if something stops working, rather than finding out days later.',
      },
    ],
    fromPrice: '₦300,000',
    relatedSlugs: ['ai-whatsapp-assistant', 'digital-consulting'],
  },
  {
    slug: 'power-bi-dashboards',
    name: 'Power BI Dashboards',
    icon: 'bar-chart',
    shortDescription: 'Turn business data into interactive dashboards and actionable insights.',
    metaDescription:
      'Power BI dashboard consulting for Nigerian businesses in Abuja — data models, interactive dashboards, and automated reporting that replace manual spreadsheet work.',
    heroSubhead:
      'Stop rebuilding the same report every month. We build Power BI dashboards that update themselves and answer the questions your leadership actually asks.',
    problem:
      'Most Nigerian SMEs and institutions run on spreadsheets that someone rebuilds by hand every week. Numbers live in different files, sales data disagrees with finance data, and by the time a report reaches management it is already out of date. Decisions get made on gut feel because the data takes too long to trust.',
    solution:
      'We connect your existing data sources — Excel, SQL databases, POS exports, Google Sheets, accounting software — into a single Power BI model, clean the data once, and build dashboards that refresh on a schedule. You get one number for revenue, one number for stock, one number for performance, and everyone looks at the same version of the truth.',
    benefits: [
      'One shared source of truth instead of conflicting spreadsheets',
      'Reporting that refreshes on its own instead of being rebuilt by hand',
      'Leadership able to drill from a company-wide number down to one branch or product',
    ],
    deliverables: [
      'Data audit and source mapping (what you have, where it lives, what is missing)',
      'Cleaned and modelled dataset in Power BI (or Excel Power Query where Power BI is not yet needed)',
      'Interactive dashboards for sales, operations, or finance — built around the decisions you actually make',
      'Scheduled data refresh so numbers stay current without manual re-uploading',
      'A short training session so your team can filter, drill down, and export without calling us every time',
    ],
    process: [
      { title: 'Discovery call', description: 'We walk through what you currently track, in what tools, and which decisions the reporting needs to support.' },
      { title: 'Data audit & modelling', description: 'We map your data sources, clean inconsistencies, and build a data model that scales as you add more.' },
      { title: 'Dashboard build', description: 'We design and build the dashboards, iterating with you on what to show first and what can move to a drill-down view.' },
      { title: 'Handover & training', description: 'You get a walkthrough session, a short reference guide, and a refresh schedule that keeps the data current.' },
    ],
    stack: ['Power BI', 'Power Query / M', 'DAX', 'SQL', 'Excel & VBA'],
    outcomes: [
      'Weekly reporting that used to take a full day compressed into a live dashboard refreshed automatically',
      'One shared source of truth across sales, operations, and finance',
      'Leadership able to drill from a company-wide number down to a single branch or product line in seconds',
    ],
    faqs: [
      {
        question: 'Do we need to already use Power BI?',
        answer:
          'No. Most clients start with Excel or raw exports from a POS or accounting system. Part of the engagement is deciding whether Power BI, an upgraded Excel workbook, or a lightweight custom dashboard is the right fit.',
      },
      {
        question: 'Can you work with our existing accounting or POS software?',
        answer: 'In most cases, yes. We connect to common export formats and databases directly, and confirm feasibility during the discovery call.',
      },
      {
        question: 'How long does a typical dashboard project take?',
        answer: 'A focused single-department dashboard usually takes two to three weeks from discovery to handover. Multi-source, company-wide reporting takes longer.',
      },
    ],
    fromPrice: '₦350,000',
    relatedSlugs: ['ai-automation', 'custom-software'],
  },
  {
    slug: 'custom-software',
    name: 'Custom Software',
    icon: 'code',
    shortDescription: 'Build tailored business applications around your specific operational requirements.',
    metaDescription:
      'Custom software development for Nigerian businesses — web applications and internal tools built around your workflow when off-the-shelf software falls short.',
    heroSubhead:
      "When the software almost fits but forces your team to work around it, it's usually cheaper to build the piece you actually need.",
    problem:
      'Off-the-shelf software is built for a generic business, not yours. Teams end up maintaining parallel spreadsheets to cover what the software cannot do, or paying for modules they never use while still missing the one feature that matters.',
    solution:
      'We design and build web applications scoped tightly around the workflow you actually run — staff management, booking systems, approvals tools, CRMs, or something specific to your operations. The goal is software that removes manual work, not software that impresses on paper but adds new work.',
    benefits: [
      'Software that matches your actual workflow, not a generic template',
      'Fewer data entry errors because information is entered once',
      'A system your team actually uses because it was built around how they work',
    ],
    deliverables: [
      'A scoped requirements document before any code is written, so cost and timeline are clear upfront',
      'A working web application matched to your workflow',
      'User roles and permissions appropriate to your team structure',
      'Database design that can grow with your business',
      'Deployment to reliable hosting, with a handover walkthrough',
    ],
    process: [
      { title: 'Requirements workshop', description: 'We map your current workflow, the gaps in existing tools, and what "done" looks like for the first version.' },
      { title: 'Technical design', description: 'We design the data model and system architecture and confirm scope and cost before development starts.' },
      { title: 'Build in stages', description: 'Development happens in reviewable stages so you see progress and can redirect early rather than at the end.' },
      { title: 'Testing & handover', description: 'The system is tested against real scenarios from your business, then deployed with training for your team.' },
    ],
    stack: ['React / Next.js', 'Node.js', 'PostgreSQL / MySQL', 'REST & webhook integrations'],
    outcomes: [
      'A single internal tool replacing three or four disconnected spreadsheets and manual processes',
      'Fewer data entry errors because information is entered once, not copied between tools',
      'A system your team actually uses because it was built around how they already work',
    ],
    faqs: [
      {
        question: 'How is this different from just buying existing software?',
        answer:
          "If an existing product genuinely covers your needs, we'll tell you that directly rather than build something unnecessary. Custom development makes sense when your workflow does not map cleanly onto what's available.",
      },
      {
        question: 'Do you provide support after launch?',
        answer: 'Yes, on a retainer or ad-hoc basis depending on how much ongoing change you expect, agreed before the project starts.',
      },
    ],
    fromPrice: '₦900,000',
    relatedSlugs: ['ai-automation', 'power-bi-dashboards'],
  },
  {
    slug: 'ai-whatsapp-assistant',
    name: 'AI WhatsApp Assistant',
    icon: 'message-circle',
    shortDescription: 'Create intelligent WhatsApp assistants for customer service, sales and business operations.',
    metaDescription:
      'AI WhatsApp assistant development for Nigerian businesses — automate customer service, sales enquiries, and order handling directly on WhatsApp.',
    heroSubhead:
      'Most of your customers already message you on WhatsApp. An AI assistant answers the routine ones instantly, day or night.',
    problem:
      'WhatsApp is often the primary sales and support channel for Nigerian businesses, but it does not scale with a human alone. Repeated questions about price, availability, and order status pile up, staff have to context-switch constantly, and enquiries that arrive after hours simply wait until morning — sometimes losing the sale.',
    solution:
      'We build an AI-powered WhatsApp assistant connected to the WhatsApp Business API that handles common enquiries, walks customers through ordering or booking, and hands off to a human staff member for anything outside its scope — with a clear, honest handoff, not a broken loop.',
    benefits: [
      'Instant responses to common questions, any time of day',
      'Staff freed from repetitive enquiries to focus on complex ones',
      'A clear handoff to a human for anything the assistant cannot resolve',
    ],
    deliverables: [
      'WhatsApp Business API setup and connection',
      'AI assistant scripted around your actual product/service enquiries and order flow',
      'Clear handoff logic to a human team member when needed',
      'Basic conversation analytics so you can see what customers actually ask',
      'Documentation and training for your team on managing the assistant',
    ],
    process: [
      { title: 'Conversation mapping', description: 'We map the enquiries and order flows your team already handles most often on WhatsApp.' },
      { title: 'Assistant build', description: 'We build and script the assistant around real conversation patterns, not generic chatbot templates.' },
      { title: 'Testing', description: 'The assistant is tested against real customer phrasing before going live, including edge cases and handoff triggers.' },
      { title: 'Launch & handover', description: 'We connect it to your WhatsApp Business number and train your team on monitoring and adjusting it.' },
    ],
    stack: ['WhatsApp Business API', 'OpenAI / LLM APIs', 'n8n', 'Webhook integrations'],
    outcomes: [
      'Faster response times on routine WhatsApp enquiries, including after hours',
      'Staff time freed from repetitive questions to focus on higher-value conversations',
      'A documented handoff path so complex enquiries still reach a human quickly',
    ],
    faqs: [
      {
        question: 'Will it sound robotic or annoy customers?',
        answer:
          'The assistant is scripted around your actual products and tone, not a generic template, and is built to hand off to a human quickly rather than trap customers in a loop.',
      },
      {
        question: 'Can it take orders directly?',
        answer: 'Yes, for straightforward order flows. More complex ordering (e.g. inventory-checked, multi-item) is scoped alongside our Custom Software or Inventory solutions.',
      },
      {
        question: 'Do we need the official WhatsApp Business API?',
        answer: 'For a reliable, scalable assistant, yes — we help set this up as part of the engagement rather than relying on an unofficial workaround.',
      },
    ],
    fromPrice: '₦400,000',
    relatedSlugs: ['ai-automation', 'custom-software'],
  },
  {
    slug: 'digital-consulting',
    name: 'Digital Consulting',
    icon: 'compass',
    shortDescription: 'Help businesses identify technology opportunities and implement practical digital solutions.',
    metaDescription:
      'Digital transformation consulting for Nigerian businesses — identify the right technology opportunities and implement practical, scoped solutions.',
    heroSubhead:
      "Not sure whether the fix is a dashboard, custom software, automation, or something simpler? That's exactly what this conversation is for.",
    problem:
      'Many businesses know something about their operations is inefficient but are not sure what to fix first, which technology actually applies, or how to avoid overspending on the wrong solution. Vendors often push whichever product they sell rather than diagnosing the actual problem.',
    solution:
      'We start with your operations, not a product pitch — reviewing your current processes, tools, and pain points, then recommending a scoped, practical path forward, whether that involves one of our other services or simply a process change with no new software at all.',
    benefits: [
      'An honest diagnosis before any tool or service is recommended',
      'A prioritised, realistic roadmap instead of a vague transformation plan',
      'Recommendations that fit your budget and team, not a one-size-fits-all package',
    ],
    deliverables: [
      'A structured review of your current operations, tools, and pain points',
      'A written assessment identifying the highest-impact opportunities',
      'A prioritised roadmap with realistic cost and timeline estimates',
      'Honest recommendations — including when the right answer is no new technology at all',
    ],
    process: [
      { title: 'Operations review', description: 'We walk through your current processes and tools to understand where time and money are actually going.' },
      { title: 'Opportunity assessment', description: 'We identify and prioritise the changes likely to have the most impact relative to their cost.' },
      { title: 'Roadmap', description: 'You get a written, prioritised roadmap with realistic scope and cost estimates for each recommended step.' },
      { title: 'Implementation support', description: 'If you choose to proceed, we can implement directly or support your in-house team through the rollout.' },
    ],
    stack: ['Process mapping', 'Data & systems audit', 'Vendor-neutral technology assessment'],
    outcomes: [
      'A clear, prioritised view of where technology investment will actually pay off',
      'Avoided spend on tools that would not have matched the real workflow',
      'A realistic roadmap the business can act on in stages',
    ],
    faqs: [
      {
        question: 'Is this just a sales pitch for your other services?',
        answer:
          'No — part of the value of an independent consulting engagement is an honest recommendation, even when that means suggesting a smaller project than you expected, a different vendor, or no new technology at all.',
      },
      {
        question: 'Can you implement the recommendations yourselves?',
        answer: 'Yes, through our other services, or we can support an in-house team through implementation if you prefer to build it yourselves.',
      },
    ],
    fromPrice: '₦200,000',
    relatedSlugs: ['power-bi-dashboards', 'ai-automation'],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}
