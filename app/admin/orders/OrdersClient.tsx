"use client";
import { useState } from "react";
import OrderStatusSelect from "./OrderStatusSelect";

type OrderItem = {
    id: number;
    productId: number;
    colorId: number | null;
    quantity: number;
    price: unknown;
    total: unknown;
    product: {
        id: number;
        name: string;
        image: string;
    };
    color: {
        id: number;
        name: string;
        hexCode: string;
    } | null;
};

type Order = {
    id: number;
    orderNumber: string;
    customerName: string;
    phone: string;
    address: string;
    subtotal: unknown;
    shippingCharge: unknown;
    total: unknown;
    paymentMethod: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number | null;
    orderItems: OrderItem[];
};

type Props = {
    orders: Order[];
};

export default function OrdersClient({ orders }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const activePage = Math.min(currentPage, Math.max(totalPages, 1));
    const paginatedOrders = orders.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left px-4 py-3 w-12">S.N.</th>
                            <th className="text-left px-4 py-3">Order #</th>
                            <th className="text-left px-4 py-3">Customer</th>
                            <th className="text-left px-4 py-3">Phone</th>
                            <th className="text-left px-4 py-3">Qty</th>
                            <th className="text-left px-4 py-3">Total</th>
                            <th className="text-left px-4 py-3">Status</th>
                            <th className="text-left px-4 py-3">Date</th>
                            <th className="text-left px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedOrders.map((o, idx) => {
                            const serialNumber = (activePage - 1) * itemsPerPage + idx + 1;
                            const totalQty = o.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                            return (
                                <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                                    <td className="px-4 py-3 text-gray-500 font-medium">{serialNumber}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{o.orderNumber}</td>
                                    <td className="px-4 py-3 font-medium">{o.customerName}</td>
                                    <td className="px-4 py-3">{o.phone}</td>
                                    <td className="px-4 py-3 font-medium">{totalQty}</td>
                                    <td className="px-4 py-3">Rs. {Number(o.total).toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <OrderStatusSelect id={o.id} currentStatus={o.status} />
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {new Date(o.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedOrder(o)}
                                            className="text-gray-600 hover:text-black font-semibold transition text-xs cursor-pointer"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {orders.length === 0 && (
                <p className="text-center text-gray-400 py-10">No orders yet.</p>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 bg-white">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={activePage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={activePage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs text-gray-700">
                                Showing{" "}
                                <span className="font-semibold">
                                    {(activePage - 1) * itemsPerPage + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-semibold">
                                    {Math.min(activePage * itemsPerPage, orders.length)}
                                </span>{" "}
                                of <span className="font-semibold">{orders.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-xs -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={activePage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-xs font-medium transition ${
                                            page === activePage
                                                ? "z-10 bg-black border-black text-white"
                                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={activePage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* View Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                            type="button"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            Order Detail <span className="font-mono text-sm text-gray-400">#{selectedOrder.orderNumber}</span>
                        </h2>

                        {/* Customer Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-gray-100 pb-4 mb-4 text-sm">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Customer Info</h3>
                                <p className="text-gray-700"><span className="text-gray-400">Name:</span> {selectedOrder.customerName}</p>
                                <p className="text-gray-700"><span className="text-gray-400">Phone:</span> {selectedOrder.phone}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Shipping Details</h3>
                                <p className="text-gray-700"><span className="text-gray-400">Address:</span> {selectedOrder.address}</p>
                                {/* <p className="text-gray-700"><span className="text-gray-400">Method:</span> {selectedOrder.paymentMethod}</p> */}
                            </div>
                        </div>

                        {/* Order Items Table */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Order Items</h3>
                            <div className="border border-gray-100 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-600">
                                        <tr>
                                            <th className="text-left px-4 py-2">Product</th>
                                            <th className="text-left px-4 py-2">Color</th>
                                            <th className="text-right px-4 py-2">Qty</th>
                                            <th className="text-right px-4 py-2">Price</th>
                                            <th className="text-right px-4 py-2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.orderItems?.map((item) => (
                                            <tr key={item.id} className="border-t border-gray-100">
                                                <td className="px-4 py-3 flex items-center gap-2">
                                                    <img src={item.product?.image} alt={item.product?.name} className="w-8 h-8 object-cover rounded shrink-0" />
                                                    <span className="font-medium">{item.product?.name}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {item.color ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: item.color.hexCode }} />
                                                            <span className="text-xs text-gray-600">{item.color.name}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right">Rs. {Number(item.price).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-medium">Rs. {Number(item.total).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="flex flex-col items-end gap-1.5 text-sm border-t border-gray-100 pt-4">
                            <div className="flex justify-between w-64 text-gray-600">
                                <span>Subtotal:</span>
                                <span>Rs. {Number(selectedOrder.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between w-64 text-gray-600">
                                <span>Shipping Charge:</span>
                                <span>Rs. {Number(selectedOrder.shippingCharge).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between w-64 font-semibold text-gray-900 border-t border-gray-100 pt-2 text-base">
                                <span>Total:</span>
                                <span>Rs. {Number(selectedOrder.total).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Close footer button */}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="bg-black text-white px-5 py-2 rounded text-sm hover:bg-gray-800 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
