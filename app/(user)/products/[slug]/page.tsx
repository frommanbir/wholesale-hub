import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { getProductBySlug } from "../../../actions/product";
import { getSettings } from "../../../actions/settings";
import OrderForm from "./OrderForm";

type Props = {
    params: Promise<{ slug: string }>;
};

/** Star rating — same logic as ProductCard */
function Stars({ rating = 4, count = 103 }: { rating?: number; count?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <svg
                    key={s}
                    width="14"
                    height="14"
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

export default async function ProductDetailPage({ params }: Props) {
    const { slug } = await params;
    const [product, settings] = await Promise.all([
        getProductBySlug(slug),
        getSettings(),
    ]);

    if (!product) return notFound();

    const colors = product.productColors.map((pc) => pc.color);
    const sizes = product.productSizes.map((ps) => ps.size);
    const shippingCharge = Number(settings?.shippingCharge ?? 0);
    const qrImage = settings?.qrImage ?? null;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
                {/* Breadcrumb */}
                <p className="text-xs text-gray-500 mb-6">
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                    {" > "}
                    <span className="text-gray-700">{product.name}</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* ── Left: Product Image ────────────────── */}
                    <div className="rounded-lg overflow-hidden bg-gray-100 aspect-[3/4] relative">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>

                    {/* ── Right: Info + Form ─────────────────── */}
                    <div className="flex flex-col gap-4">
                        {/* Name */}
                        <h1 className="text-xl font-bold text-gray-900 leading-snug">
                            {product.name}
                        </h1>

                        {/* Star Rating */}
                        <Stars rating={4} count={103} />

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                            {Number(product.discount) > 0 ? (
                                <>
                                    <span className="text-2xl font-bold text-gray-900">
                                        Rs. {(Number(product.price) - Number(product.discount)).toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-405 line-through">
                                        Rs. {Number(product.price).toLocaleString()}
                                    </span>
                                    <span className="text-xs text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full ml-1">
                                        Rs. {Number(product.discount).toLocaleString()} OFF
                                    </span>
                                </>
                            ) : (
                                <span className="text-2xl font-bold text-gray-900">
                                    Rs. {Number(product.price).toLocaleString()}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 leading-relaxed text-justify">
                            {product.description}
                        </p>

                        {/* Order Form */}
                        <OrderForm
                            productId={product.id}
                            price={Number(product.price) - Number(product.discount ?? 0)}
                            shippingCharge={shippingCharge}
                            colors={colors}
                            sizes={sizes}
                            qrImage={qrImage}
                        />

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                            {[
                                {
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 mx-auto text-gray-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                    ),
                                    label: "Secure Payment",
                                },
                                {
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 mx-auto text-gray-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                    ),
                                    label: "Easy Returns",
                                },
                                {
                                    icon: (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 mx-auto text-gray-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ),
                                    label: "24/7 Support",
                                },
                            ].map((b) => (
                                <div
                                    key={b.label}
                                    className="border border-gray-200 rounded-lg py-3 px-1"
                                >
                                    <div className="mb-1">{b.icon}</div>
                                    <p className="text-xs text-gray-600 font-medium">{b.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
