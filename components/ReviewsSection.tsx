import Image from 'next/image';
import { Star } from 'lucide-react';
import { getGoogleReviews } from '@/lib/google-reviews';
import { siteConfig } from '@/lib/site-config';

export default async function ReviewsSection() {
  const { configured, rating, totalReviews, reviews } = await getGoogleReviews();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Google Reviews</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">What clients say on Google</h2>
        </div>
        {rating !== null && totalReviews !== null && (
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-card">
            <span className="font-display text-xl font-bold text-ink">{rating.toFixed(1)}</span>
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.round(rating) ? 'fill-accent text-accent' : 'text-slate-300'}
                />
              ))}
            </div>
            <span className="text-sm text-ink/60">({totalReviews} reviews)</span>
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <figure key={i} className="card">
              <div className="mb-3 flex items-center gap-3">
                {review.authorPhotoUrl ? (
                  <Image
                    src={review.authorPhotoUrl}
                    alt={review.authorName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 font-semibold text-brand">
                    {review.authorName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-ink">{review.authorName}</p>
                  <p className="text-xs text-ink/50">{review.relativeTimeDescription}</p>
                </div>
              </div>
              <div className="mb-2 flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={14}
                    className={s < review.rating ? 'fill-accent text-accent' : 'text-slate-300'}
                  />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-ink/75">{review.text}</blockquote>
            </figure>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm text-ink/60">
            {configured
              ? "We couldn't retrieve reviews from Google just now — see them directly on our Google listing."
              : 'Google Reviews integration is not yet connected. Once configured with a live Google Place ID, real reviews will appear here automatically — never fabricated.'}
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <a
          href={siteConfig.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-brand hover:underline"
        >
          View all reviews on Google &rarr;
        </a>
      </div>
    </div>
  );
}
