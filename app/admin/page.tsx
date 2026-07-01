import { prisma } from "../lib/prisma";

export default async function AdminDashboard() {
    const [productCount, orderCount, pendingCount] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.count({ where: { status: "pending" } }),
    ]);

    const stats = [
        { label: "Total Products", value: productCount },
        { label: "Total Orders", value: orderCount },
        { label: "Pending Orders", value: pendingCount },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((s) => (
                    <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-sm text-gray-500">{s.label}</p>
                        <p className="text-3xl font-bold mt-1">{s.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
