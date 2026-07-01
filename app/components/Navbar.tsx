import Link from "next/link";
import { getSettings } from "../actions/settings";

function WholesaleHubLogo({ siteName }: { siteName?: string | null }) {
    if (siteName && siteName !== "Wholesale Hub") {
        return <span className="font-bold text-base">{siteName}</span>;
    }
    return (
        <div className="flex flex-col items-start leading-none select-none">
            <span
                className="text-gray-800 font-semibold"
                style={{ fontSize: "9px", letterSpacing: "0.18em" }}
            >
                WHOLESALE
            </span>
            <div
                className="flex items-center gap-1 bg-gray-900 text-white px-1.5 py-0.5 mt-0.5"
                style={{ fontSize: "10px" }}
            >
                {/* Simple building SVG icon */}
                <svg width="11" height="10" viewBox="0 0 11 10" fill="currentColor">
                    <rect x="0" y="5" width="4" height="5" />
                    <rect x="7" y="5" width="4" height="5" />
                    <polygon points="5.5,0 0,5 11,5" />
                    <rect x="4" y="7" width="3" height="3" fill="#fff" opacity="0.3" />
                </svg>
                <span className="font-bold tracking-widest">HUB</span>
            </div>
        </div>
    );
}

export default async function Navbar() {
    const settings = await getSettings();

    return (
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="block">
                    {settings?.logo ? (
                        <img
                            src={settings.logo}
                            alt={settings.siteName}
                            className="h-9 object-contain"
                        />
                    ) : (
                        <WholesaleHubLogo siteName={settings?.siteName} />
                    )}
                </Link>

                {/* CTA Button */}
                <Link
                    href="/products"
                    className="border border-gray-800 text-gray-800 text-sm px-4 py-1.5 rounded-full hover:bg-gray-900 hover:text-white transition-colors duration-200 whitespace-nowrap"
                >
                    Place Wholesale Order
                </Link>
            </div>
        </header>
    );
}
