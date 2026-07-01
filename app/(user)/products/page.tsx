import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../actions/product";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "All Collections — Wholesale Hub",
    description: "Explore our premium wholesale sarees and apparel collection.",
};

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
                {/* Breadcrumb / Title Header */}
                <div className="mb-8">
                    <p className="text-xs text-gray-500 mb-2">
                        <a href="/" className="hover:underline">Home</a>
                        {" > "}
                        <span className="text-gray-700">Products</span>
                    </p>
                    <h1 className="text-3xl font-semibold text-gray-900">Our Collections</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Showing {products.length} high-quality wholesale products.
                    </p>
                </div>

                {/* Products Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product, i) => (
                            <ProductCard
                                key={product.id}
                                name={product.name}
                                slug={product.slug}
                                image={product.image}
                                price={product.price.toString()}
                                discount={product.discount?.toString() ?? "0"}
                                rating={i % 3 === 1 ? 5 : 4}
                                reviewCount={100 + i * 12 + 3}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-400 text-sm">No products found in our collections.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}