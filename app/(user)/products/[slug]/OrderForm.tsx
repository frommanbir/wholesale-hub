"use client";
import { useState } from "react";
import { placeOrder } from "../../../actions/order";

type Color = { id: number; name: string; hexCode: string };

type Props = {
    productId: number;
    price: number;
    shippingCharge: number;
    colors: Color[];
};

export default function OrderForm({ productId, price, shippingCharge, colors }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [selectedColorId, setSelectedColorId] = useState<number | null>(
        colors[0]?.id ?? null
    );
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    const subtotal = price * quantity;
    const total = subtotal + shippingCharge;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const result = await placeOrder({
            customerName: name,
            phone,
            address,
            productId,
            colorId: selectedColorId,
            quantity,
            price,
            shippingCharge,
        });
        setLoading(false);
        if (result.success) setOrderNumber(result.orderNumber);
    }

    if (orderNumber) {
        return (
            <div className="border border-green-200 rounded-lg p-6 bg-green-50 text-center">
                <div className="text-3xl mb-2">✓</div>
                <p className="text-green-700 font-semibold text-lg">Order Placed!</p>
                <p className="text-sm text-gray-600 mt-2">
                    Order Number:{" "}
                    <strong className="font-mono">{orderNumber}</strong>
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Available Colors (Interactive) */}
            {colors.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-800">Available Colors</span>
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                            {colors.find((c) => c.id === selectedColorId)?.name || ""}
                        </span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {colors.map((color) => {
                            const isSelected = selectedColorId === color.id;
                            return (
                                <button
                                    key={color.id}
                                    type="button"
                                    onClick={() => setSelectedColorId(color.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer select-none ${
                                        isSelected
                                            ? "border-black bg-black text-white"
                                            : "border-gray-200 bg-white text-gray-750 hover:border-gray-300"
                                    }`}
                                >
                                    <span
                                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                                        style={{ backgroundColor: color.hexCode }}
                                    />
                                    <span>{color.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Order Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-[15px] flex items-center gap-2 text-gray-900">
                        🛍️ Order Now
                    </h2>
                </div>

                <div className="px-5 py-4 space-y-4">
                    {/* Quantity Row */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 font-medium">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded">
                            <button
                                type="button"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-lg"
                            >
                                −
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-lg"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="border-t border-gray-100 pt-3 space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>Rs. {subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping Charge:</span>
                            <span>Rs. {shippingCharge.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-100 pt-2 text-[15px]">
                            <span>Total:</span>
                            <span>Rs. {total.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Customer Info Form */}
                    <form onSubmit={handleSubmit} className="space-y-3 border-t border-gray-100 pt-3">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-gray-450 font-medium">Full Name*</span>
                                <span className="text-[10px] text-gray-400">{name.length} / 100</span>
                            </div>
                            <input
                                required
                                type="text"
                                maxLength={100}
                                placeholder="e.g. Ram Bahadur"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-gray-500 placeholder:text-gray-400"
                            />
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-gray-450 font-medium">Phone Number*</span>
                                <span className="text-[10px] text-gray-400">{phone.length} / 20</span>
                            </div>
                            <input
                                required
                                type="tel"
                                maxLength={20}
                                placeholder="e.g. 9812345678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-gray-500 placeholder:text-gray-400"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] text-gray-450 font-medium">Address*</span>
                                <span className="text-[10px] text-gray-400">{address.length} / 500</span>
                            </div>
                            <input
                                required
                                type="text"
                                maxLength={500}
                                placeholder="e.g. New Road, Kathmandu"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-gray-500 placeholder:text-gray-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-3 rounded text-sm cursor-pointer font-medium hover:bg-black transition-colors disabled:opacity-60 mt-1"
                        >
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>
                        <div className="w-full border border-gray-200 rounded py-2.5 text-center text-xs text-gray-500">
                            Cash On Delivery
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
