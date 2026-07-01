import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <main className="flex-1 flex items-center justify-center px-4 py-20">
                <div className="text-center max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
                    {/* Visual Icon */}
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">404</h1>
                    <h2 className="text-lg font-bold text-gray-800 mb-3">Page Not Found</h2>
                    
                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="bg-gray-900 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded hover:bg-black transition shadow-sm"
                        >
                            Go to Homepage
                        </Link>
                        <Link
                            href="/#collections"
                            className="bg-white border border-gray-250 text-gray-800 text-xs font-semibold uppercase tracking-wider px-6 py-3 rounded hover:bg-gray-50 transition"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
