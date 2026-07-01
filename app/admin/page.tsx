import Link from "next/link";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const [productCount, orderCount, pendingCount] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: "pending" } }),
    ]);

    const stats = [
        {
            label: "Total Products",
            value: productCount,
            href: "/admin/product",
            color: "text-blue-600 bg-blue-50 border-blue-100",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            label: "Total Orders",
            value: orderCount,
            href: "/admin/orders",
            color: "text-green-600 bg-green-50 border-green-100",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
        },
        {
            label: "Pending Orders",
            value: pendingCount,
            href: "/admin/orders?status=pending",
            color: "text-amber-600 bg-amber-50 border-amber-100",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8 text-gray-900">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((s) => (
                    <Link
                        key={s.label}
                        href={s.href}
                        className="group bg-white rounded-2xl p-6 shadow-xs border border-gray-150/80 flex items-center justify-between hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
                    >
                        <div>
                            <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">{s.label}</p>
                            <p className="text-4xl font-extrabold mt-2 text-gray-900 group-hover:scale-[1.02] transition-transform duration-200 origin-left">{s.value}</p>
                        </div>
                        <div className={`p-3 rounded-xl border ${s.color} transition-transform duration-200 group-hover:scale-110`}>
                            {s.icon}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
