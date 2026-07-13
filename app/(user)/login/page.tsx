"use client";
import { useState } from "react";
import Link from "next/link";
import { loginUser } from "../../actions/auth";

export default function LoginPage() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const result = await loginUser({ phone, password });
        setLoading(false);
        if (!result.success) {
            setError(result.message ?? "Login failed");
        } else {
            // Redirect based on role — cookie is already set by the server action
            if (result.role === "admin") {
                localStorage.removeItem("admin_logged_out");
                const lastTab = localStorage.getItem("admin_last_tab") || "/admin";
                window.location.href = lastTab;
            } else {
                window.location.href = "/";
            }
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl p-8">
                <h1 className="text-xl font-bold text-center mb-1">Welcome Back</h1>
                <p className="text-xs text-gray-500 text-center mb-6">Login to your account</p>

                {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        required
                        type="tel"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
                    />
                    <input
                        required
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-black"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
