import Link from "next/link";
import { logoutUser } from "../actions/auth";

const navLinks = [
    { label: "Dashboard", href: "/admin" },
    { label: "Products", href: "/admin/product" },
    { label: "Orders", href: "/admin/orders" },
    { label: "Colors", href: "/admin/colors" },
    { label: "Contact", href: "/admin/contacts" },
    { label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-56 bg-black text-white flex flex-col h-screen sticky top-0 shadow-md">
                <div className="px-6 py-5 border-b border-white/10">
                    <span className="font-bold text-sm tracking-wide">Admin Panel</span>
                </div>
                <nav className="flex flex-col gap-1 p-4 flex-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm px-3 py-2 rounded hover:bg-white/10 transition"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                {/* Logout */}
                <form action={logoutUser} className="p-4 border-t border-white/10">
                    <button
                        type="submit"
                        className="w-full text-sm px-3 py-2 rounded text-white/70 hover:bg-white/10 transition text-left"
                    >
                        Logout
                    </button>
                </form>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">{children}</main>
        </div>
    );
}
