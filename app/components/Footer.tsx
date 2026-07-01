import Link from "next/link";
import { getSettings } from "../actions/settings";

function WholesaleHubLogo({ siteName }: { siteName?: string | null }) {
    if (siteName && siteName !== "Wholesale Hub") {
        return <span className="font-bold text-sm">{siteName}</span>;
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

export default async function Footer() {
    const settings = await getSettings();

    return (
        <footer className="border-t border-gray-200 bg-white mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="block">
                    <WholesaleHubLogo siteName={settings?.siteName} />
                </Link>

                {/* Social Icons */}
                <div className="flex gap-2">
                    {/* Facebook */}
                    <a
                        href={settings?.facebook ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500 hover:text-gray-900 transition text-sm font-medium"
                        aria-label="Facebook"
                    >
                        f
                    </a>
                    {/* Instagram */}
                    <a
                        href={settings?.instagram ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500 hover:text-gray-900 transition"
                        aria-label="Instagram"
                    >
                        {/* Camera icon */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                        </svg>
                    </a>
                    {/* Twitter/X */}
                    <a
                        href={settings?.twitter ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-500 hover:text-gray-900 transition"
                        aria-label="Twitter"
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>
                </div>

                {/* Copyright */}
                <p className="text-xs text-gray-500">
                    © {new Date().getFullYear()} All rights reserved.
                </p>
            </div>
        </footer>
    );
}
