"use client";
import { useState } from "react";
import { createContact } from "../../actions/contact";

export default function WholesalePartnerForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await createContact({ name, phone, address });
            if (res && !res.success) {
                setError(res.message || "Something went wrong. Please try again.");
            } else {
                setSuccess(true);
                setName("");
                setPhone("");
                setAddress("");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        }
        setLoading(false);
    }

    if (success) {
        return (
            <div className="border border-green-200 rounded-lg p-6 bg-green-50 text-center">
                <div className="text-3xl mb-2 text-green-600">✓</div>
                <p className="text-green-700 font-semibold text-lg">Inquiry Submitted!</p>
                <p className="text-xs text-gray-500 mt-2">
                    Thank you for your interest. We will contact you soon on your phone number.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-xs text-black font-semibold hover:underline"
                >
                    Submit another inquiry
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-gray-500 block font-medium">Full Name*</label>
                    <span className="text-[10px] text-gray-400">{name.length} / 100</span>
                </div>
                <input
                    required
                    type="text"
                    maxLength={100}
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-black placeholder:text-gray-400"
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-gray-500 block font-medium">Contact Number*</label>
                    <span className="text-[10px] text-gray-400">{phone.length} / 20</span>
                </div>
                <input
                    required
                    type="tel"
                    maxLength={20}
                    placeholder="Your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-black placeholder:text-gray-400"
                />
            </div>

            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-gray-500 block font-medium">Business / Shop Address*</label>
                    <span className="text-[10px] text-gray-400">{address.length} / 500</span>
                </div>
                <textarea
                    required
                    rows={3}
                    maxLength={500}
                    placeholder="Full Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-black placeholder:text-gray-400 resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50 mt-2 cursor-pointer"
            >
                {loading ? "Submitting Inquiry..." : "Submit Inquiry"}
            </button>
        </form>
    );
}
