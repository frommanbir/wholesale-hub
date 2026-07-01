import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductsListClient from "./ProductsListClient";
import { getProducts } from "../../actions/product";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "All Collections — Wholesale Hub",
    description: "Explore our premium wholesale sarees and apparel collection.",
};

export default async function ProductsPage() {
    const products = await getProducts();
    const serializedProducts = JSON.parse(JSON.stringify(products));

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
                        Explore our premium wholesale sarees and clothing range.
                    </p>
                </div>

                <ProductsListClient initialProducts={serializedProducts} />
            </main>

            <Footer />
        </div>
    );
}