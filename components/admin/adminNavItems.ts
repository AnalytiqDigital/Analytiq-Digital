import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  FileText,
  Users,
  MessageSquareQuote,
  Star,
  Newspaper,
  Inbox,
  ImageIcon,
  Settings,
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
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];
