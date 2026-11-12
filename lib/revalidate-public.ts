import { revalidatePath } from 'next/cache';

// Public ISR pages that depend on each admin resource. Called from admin
// mutation routes so editor saves go live immediately instead of waiting
// out the revalidation window.
const PATHS_BY_RESOURCE: Record<string, string[]> = {
  portfolio: ['/', '/portfolio'],
  'case-studies': ['/', '/case-studies'],
  clients: ['/'],
  testimonials: ['/'],
};

export function revalidatePublicPages(resource: string) {
  for (const path of PATHS_BY_RESOURCE[resource] ?? []) {
    revalidatePath(path);
  }
}
