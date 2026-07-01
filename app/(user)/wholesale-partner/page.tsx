import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WholesalePartnerForm from "./WholesalePartnerForm";

export const metadata = {
    title: "Become a Wholesale Partner — Wholesale Hub",
    description: "Partner with us to get premium sarees and apparel at wholesale pricing.",
};

export default function WholesalePartnerPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            <main className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
                <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
                        Become a Wholesale Partner
                    </h1>
                    <p className="text-xs text-gray-500 text-center mb-6">
                        Submit your details and our team will get in touch with you.
                    </p>

                    <WholesalePartnerForm />
                </div>
            </main>

            <Footer />
        </div>
    );
}
