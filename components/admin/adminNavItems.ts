import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  FileText,
  Users,
  MessageSquareQuote,
  MessageSquare,
  Star,
  Newspaper,
  Inbox,
  ImageIcon,
  Settings,
  Receipt,
  SquareKanban,
  CalendarClock,
  UserRound,
  ListChecks,
  Megaphone,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const adminNavItems: AdminNavItem[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/portfolio', label: 'Portfolio', icon: FolderKanban },
  { href: '/admin/case-studies', label: 'Case Studies', icon: FileText },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/reviews', label: 'Google Reviews', icon: Star },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
  { href: '/admin/portal-clients', label: 'Portal Clients', icon: UserRound },
  { href: '/admin/portal-projects', label: 'Portal Projects', icon: SquareKanban },
  { href: '/admin/portal-milestones', label: 'Portal Milestones', icon: ListChecks },
  { href: '/admin/portal-updates', label: 'Portal Updates', icon: Megaphone },
  { href: '/admin/portal-invoices', label: 'Portal Invoices', icon: Receipt },
  { href: '/admin/portal-renewals', label: 'Portal Renewals', icon: CalendarClock },
  { href: '/admin/whatsapp', label: 'WhatsApp Inbox', icon: MessageSquare },
  { href: '/admin/visits', label: 'Visitor Feed', icon: Inbox },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];
