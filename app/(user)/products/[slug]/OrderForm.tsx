"use client";
import { useState } from "react";
import { placeOrder } from "../../../actions/order";

type Color = { id: number; name: string; hexCode: string };
type Size = { id: number; name: string };

type Props = {
    productId: number;
    price: number;
    shippingCharge: number;
    colors: Color[];
    sizes: Size[];
    qrImage: string | null;
};

export default function OrderForm({ productId, price, shippingCharge, colors, sizes, qrImage }: Props) {
    const [quantity, setQuantity] = useState(1);
    const [selectedColorId, setSelectedColorId] = useState<number | null>(
        colors[0]?.id ?? null
    );
    const [selectedSizeId, setSelectedSizeId] = useState<number | null>(
        sizes[0]?.id ?? null
    );
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Payment method: "cod" or "qr"
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "qr">("cod");
    const [showQrModal, setShowQrModal] = useState(false);

    const subtotal = price * quantity;
    const total = subtotal + shippingCharge;

    function handleSelectQr() {
        setPaymentMethod("qr");
        setShowQrModal(true);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (phone.length !== 10) {
            setError("Phone number must be exactly 10 digits");
            return;
        }
        setError(null);
        setLoading(true);
        const result = await placeOrder({
            customerName: name,
            phone: `+977${phone}`,
            address,
            productId,
            colorId: selectedColorId,
            sizeId: selectedSizeId,
            quantity,
            price,
            shippingCharge,
            paymentMethod: paymentMethod === "qr" ? "QR Payment" : "Cash on Delivery",
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
        <>
            {/* ── QR Modal ─────────────────────────────────── */}
            {showQrModal && qrImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowQrModal(false)}
                >
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs flex flex-col items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            type="button"
                            onClick={() => setShowQrModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
                            aria-label="Close QR modal"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center">
                            <p className="font-semibold text-gray-900 text-base">Scan to Pay</p>
                            <p className="text-xs text-gray-500 mt-0.5">Use your banking app to scan & pay</p>
                        </div>

                        {/* QR code image */}
                        <div className="border-4 border-gray-100 rounded-xl overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={qrImage}
                                alt="QR Payment Code"
                                className="w-52 h-52 object-contain"
                            />
                        </div>

                        <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">
                                Total: <span className="text-green-600">Rs. {total.toLocaleString()}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">After payment, place your order below</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowQrModal(false)}
                            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-black transition"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

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

                {/* Available Sizes (Interactive) */}
                {sizes.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-800">Available Sizes</span>
                            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                                {sizes.find((s) => s.id === selectedSizeId)?.name || ""}
                            </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {sizes.map((size) => {
                                const isSelected = selectedSizeId === size.id;
                                return (
                                    <button
                                        key={size.id}
                                        type="button"
                                        onClick={() => setSelectedSizeId(size.id)}
                                        className={`flex items-center justify-center min-w-[40px] px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition cursor-pointer select-none ${
                                            isSelected
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        <span>{size.name}</span>
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

                        {/* Payment Method Selection */}
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-xs text-gray-500 font-medium mb-2">Payment Method</p>
                            <div className="flex gap-2">
                                {/* Cash on Delivery */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("cod")}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition cursor-pointer ${
                                        paymentMethod === "cod"
                                            ? "border-gray-900 bg-gray-900 text-white"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                                    }`}
                                >
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Cash on Delivery
                                </button>

                                {/* QR Payment — only shown if admin uploaded a QR image */}
                                {qrImage && (
                                    <button
                                        type="button"
                                        onClick={handleSelectQr}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition cursor-pointer ${
                                            paymentMethod === "qr"
                                                ? "border-gray-900 bg-gray-900 text-white"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                                        }`}
                                    >
                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        QR Payment
                                    </button>
                                )}
                            </div>

                            {/* Show re-open QR button if user already picked QR */}
                            {/* {paymentMethod === "qr" && qrImage && (
                                <button
                                    type="button"
                                    onClick={() => setShowQrModal(true)}
                                    className="mt-2 w-full text-xs text-gray-500 underline underline-offset-2 hover:text-gray-800 transition text-center"
                                >
                                    View QR Code again
                                </button>
                            )} */}
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
                                </div>
                                <div className="flex rounded border border-gray-300 focus-within:border-gray-500 overflow-hidden bg-white">
                                    <span className="bg-gray-100 px-3 py-2.5 text-sm text-gray-500 border-r border-gray-200 select-none flex items-center font-medium">
                                        +977
                                    </span>
                                    <input
                                        required
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        title="Phone number must be exactly 10 digits"
                                        placeholder="e.g. 9812345678"
                                        value={phone}
                                        onChange={(e) => {
                                            const cleanVal = e.target.value.replace(/\D/g, "");
                                            if (cleanVal.length <= 10) {
                                                setPhone(cleanVal);
                                                setError(null);
                                            }
                                        }}
                                        className="w-full px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 bg-transparent"
                                    />
                                </div>
                                {error && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">
                                        {error}
                                    </p>
                                )}
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
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
