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
            await createContact({ name, phone, address });
            setSuccess(true);
            setName("");
            setPhone("");
            setAddress("");
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
                <label className="text-xs text-gray-500 mb-1 block font-medium">Full Name*</label>
                <input
                    required
                    type="text"
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-black placeholder:text-gray-400"
                />
            </div>

            <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Contact Number*</label>
                <input
                    required
                    type="tel"
                    placeholder="Your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-black placeholder:text-gray-400"
                />
            </div>

            <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Business / Shop Address*</label>
                <textarea
                    required
                    rows={3}
                    placeholder="Full Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-black placeholder:text-gray-400 resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50 mt-2"
            >
                {loading ? "Submitting Inquiry..." : "Submit Inquiry"}
            </button>
        </form>
    );
}
