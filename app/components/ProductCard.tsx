import Link from "next/link";

type Props = {
  name: string;
  slug: string;
  image: string;
  price: number | string;
  discount?: number | string;
  /** Static display rating 1-5, defaults to 4 */
  rating?: number;
  /** Review count shown in parentheses */
  reviewCount?: number;
};

/** Simple star display — purely visual, not interactive */
function Stars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={s <= rating ? "#FBBF24" : "none"}
          stroke={s <= rating ? "#FBBF24" : "#D1D5DB"}
          strokeWidth="1.5"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">({count})</span>
    </div>
  );
}

export default function ProductCard({
  name,
  slug,
  image,
  price,
  discount = 0,
  rating = 4,
  reviewCount = 102,
}: Props) {
  return (
    <div className="group bg-white rounded overflow-hidden">
      {/* Image — 3:4 portrait ratio */}
      <Link
        href={`/products/${slug}`}
        className="block overflow-hidden bg-gray-100"
        style={{ aspectRatio: "3/4" }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Info */}
      <div className="pt-2 pb-2">
        {/* Name */}
        <Link href={`/products/${slug}`} className="block">
          <p className="text-sm text-gray-800 line-clamp-2 hover:underline">
            {name}
          </p>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-0.5">
          {Number(discount) > 0 ? (
            <>
              <span className="text-sm font-bold text-gray-900">
                Rs. {(Number(price) - Number(discount)).toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 line-through">
                Rs. {Number(price).toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-gray-900">
              Rs. {Number(price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Stars + Shop Now */}
        <div className="flex items-center justify-between mt-1.5">
          <Stars rating={rating} count={reviewCount} />
          <Link
            href={`/products/${slug}`}
            className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded hover:bg-black transition-colors duration-200 shrink-0"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
