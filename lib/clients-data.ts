export interface ClientLogo {
  name: string;
  logoUrl: string;
}

// Intentionally empty — no client logos have been supplied yet. Populate
// this via the admin dashboard (/admin/clients) once real client logos and
// permission to display them are available. The slider below shows clearly
// labelled placeholder slots when this list is empty, rather than inventing
// client names.
export const clients: ClientLogo[] = [];
