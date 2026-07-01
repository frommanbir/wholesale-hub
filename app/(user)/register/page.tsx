"use client";
import { useState } from "react";
import Link from "next/link";
import { registerUser } from "../../actions/auth";

export default function RegisterPage() {
    const [form, setForm] = useState({ name: "", phone: "", password: "", address: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const result = await registerUser(form);
        setLoading(false);
        if (!result.success) {
            setError(result.message ?? "Registration failed");
        } else {
            window.location.href = "/login";
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8">
                <h1 className="text-xl font-bold text-center mb-1">Create Account</h1>
                <p className="text-xs text-gray-500 text-center mb-6">
                    Register as a wholesale partner
                </p>

                {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { name: "name", placeholder: "Full Name", type: "text" },
                        { name: "phone", placeholder: "Phone Number", type: "tel" },
                        { name: "password", placeholder: "Password", type: "password" },
                        { name: "address", placeholder: "Address", type: "text" },
                    ].map((field) => (
                        <input
                            key={field.name}
                            required
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={form[field.name as keyof typeof form]}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
                        />
                    ))}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-5">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
