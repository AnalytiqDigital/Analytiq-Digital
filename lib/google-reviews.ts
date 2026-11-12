export interface GoogleReview {
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  text: string;
  relativeTimeDescription: string;
  time: number; // unix timestamp
}

export interface GoogleReviewsResult {
  configured: boolean;
  rating: number | null;
  totalReviews: number | null;
  reviews: GoogleReview[];
  error?: string;
}

/**
 * Fetches real Google reviews via the Google Places API (Place Details),
 * server-side only. Never fabricates review content — if the required
 * environment variables are not set, or the request fails, it returns an
 * unconfigured/empty result rather than placeholder data.
 *
 * Required env vars (server-only, never exposed to the client):
 *   GOOGLE_PLACES_API_KEY - a Places API key restricted to server IPs
 *   GOOGLE_PLACE_ID       - the Place ID for the AnalytIQ Digital listing
 *
 * Note: the Places API returns at most 5 reviews per request, and only
 * "most relevant" reviews as selected by Google, not the full review list.
 * For a complete review archive, reviews would need to be periodically
 * synced into the database via the admin dashboard's "Sync now" action
 * (see /admin/reviews) rather than fetched live on every page load.
 */
export async function getGoogleReviews(): Promise<GoogleReviewsResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return { configured: false, rating: null, totalReviews: null, reviews: [] };
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('fields', 'rating,user_ratings_total,reviews');
    url.searchParams.set('key', apiKey);

    // Bound the external call so a slow Google API can't stall the whole
    // home page render. On timeout/abort we fall through to the catch below
    // and render the placeholder instead of blocking.
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      return {
        configured: true,
        rating: null,
        totalReviews: null,
        reviews: [],
        error: `Google Places API responded with status ${res.status}`,
      };
    }

    const data = await res.json();
    if (data.status !== 'OK') {
      return {
        configured: true,
        rating: null,
        totalReviews: null,
        reviews: [],
        error: `Google Places API status: ${data.status}`,
      };
    }

    const result = data.result || {};
    const reviews: GoogleReview[] = (result.reviews || []).map((r: any) => ({
      authorName: r.author_name,
      authorPhotoUrl: r.profile_photo_url,
      rating: r.rating,
      text: r.text,
      relativeTimeDescription: r.relative_time_description,
      time: r.time,
    }));

    return {
      configured: true,
      rating: result.rating ?? null,
      totalReviews: result.user_ratings_total ?? null,
      reviews,
    };
  } catch (err) {
    return {
      configured: true,
      rating: null,
      totalReviews: null,
      reviews: [],
      error: err instanceof Error ? err.message : 'Unknown error fetching Google reviews',
    };
  }
}
