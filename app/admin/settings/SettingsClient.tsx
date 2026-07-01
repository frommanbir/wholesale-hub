"use client";
import { useState, useRef } from "react";
import { saveSettings, saveHomepageSettings } from "../../actions/settings";

type Setting = {
    id: number;
    siteName: string;
    email: string;
    phone: string;
    address: string;
    shippingCharge: unknown;
    logo?: string | null;
    favicon?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
} | null;

type HomepageSetting = {
    id: number;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    image: string;
} | null;

/* ─── Reusable mini image-upload picker ─────────────────────────────── */
type ImagePickerProps = {
    label: string;
    /** Current value (an existing URL or empty string) */
    currentUrl: string;
    /** Called with the new public URL after a successful upload */
    onUploaded: (url: string) => void;
    /** Hint shown below the label */
    hint?: string;
    /** Max width for the preview thumbnail */
    previewClass?: string;
};

function ImagePicker({ label, currentUrl, onUploaded, hint, previewClass = "h-16 w-16" }: ImagePickerProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const ref = useRef<HTMLInputElement>(null);

    async function handleFile(file: File) {
        setError("");
        if (!file.type.startsWith("image/")) { setError("Images only."); return; }
        if (file.size > 5 * 1024 * 1024) { setError("Max 5 MB."); return; }

        setUploading(true);
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        setUploading(false);

        if (!res.ok || !data.url) { setError(data.error ?? "Upload failed."); return; }
        onUploaded(data.url);
    }

    return (
        <div>
            <label className="text-xs text-gray-500 mb-1 block">{label}</label>
            {hint && <p className="text-[11px] text-gray-400 mb-1">{hint}</p>}

            <div className="flex items-center gap-3">
                {/* Thumbnail preview */}
                {currentUrl ? (
                    <img
                        src={currentUrl}
                        alt={label}
                        className={`${previewClass} object-cover rounded border border-gray-200 shrink-0`}
                    />
                ) : (
                    <div className={`${previewClass} rounded border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center shrink-0`}>
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5M21 3.75H3M12 9.75h.008v.008H12V9.75z" />
                        </svg>
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    {/* Upload button */}
                    <button
                        type="button"
                        onClick={() => ref.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-1.5 border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 transition disabled:opacity-60"
                    >
                        {uploading ? (
                            <>
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Uploading…
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                {currentUrl ? "Change image" : "Upload image"}
                            </>
                        )}
                    </button>

                    {/* Current path pill */}
                    {currentUrl && (
                        <p className="text-[11px] text-gray-400 mt-1 truncate">{currentUrl}</p>
                    )}

                    {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
                </div>
            </div>

            {/* Hidden real input */}
            <input
                ref={ref}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
        </div>
    );
}

/* ─── Main settings form ────────────────────────────────────────────── */
export default function SettingsClient({
    settings,
    homepage,
}: {
    settings: Setting;
    homepage: HomepageSetting;
}) {
    const [siteForm, setSiteForm] = useState({
        siteName: settings?.siteName ?? "",
        email: settings?.email ?? "",
        phone: settings?.phone ?? "",
        address: settings?.address ?? "",
        shippingCharge: String(settings?.shippingCharge ?? "0"),
        logo: settings?.logo ?? "",
        favicon: settings?.favicon ?? "",
        facebook: settings?.facebook ?? "",
        instagram: settings?.instagram ?? "",
        twitter: settings?.twitter ?? "",
    });

    const [heroForm, setHeroForm] = useState({
        title: homepage?.title ?? "",
        subtitle: homepage?.subtitle ?? "",
        buttonText: homepage?.buttonText ?? "",
        buttonLink: homepage?.buttonLink ?? "",
        image: homepage?.image ?? "",
    });

    const [siteLoading, setSiteLoading] = useState(false);
    const [heroLoading, setHeroLoading] = useState(false);
    const [siteMsg, setSiteMsg] = useState("");
    const [heroMsg, setHeroMsg] = useState("");

    async function handleSiteSave(e: React.FormEvent) {
        e.preventDefault();
        setSiteLoading(true);
        setSiteMsg("");
        await saveSettings({
            ...siteForm,
            shippingCharge: parseFloat(siteForm.shippingCharge) || 0,
        });
        setSiteLoading(false);
        setSiteMsg("✓ Site settings saved!");
    }

    async function handleHeroSave(e: React.FormEvent) {
        e.preventDefault();
        setHeroLoading(true);
        setHeroMsg("");
        await saveHomepageSettings(heroForm);
        setHeroLoading(false);
        setHeroMsg("✓ Homepage settings saved!");
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* ── Site Settings ───────────────────────────── */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Site Settings</h2>
                {siteMsg && <p className="text-green-600 text-sm mb-3">{siteMsg}</p>}

                <form onSubmit={handleSiteSave} className="space-y-4">

                    {/* Text fields */}
                    {[
                        { label: "Site Name", key: "siteName" },
                        { label: "Email", key: "email" },
                        { label: "Phone", key: "phone" },
                        { label: "Address", key: "address" },
                        { label: "Shipping Charge (Rs.)", key: "shippingCharge" },
                        { label: "Facebook URL", key: "facebook" },
                        { label: "Instagram URL", key: "instagram" },
                        { label: "Twitter URL", key: "twitter" },
                    ].map((f) => (
                        <div key={f.key}>
                            <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                            <input
                                value={siteForm[f.key as keyof typeof siteForm]}
                                onChange={(e) =>
                                    setSiteForm((p) => ({ ...p, [f.key]: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                            />
                        </div>
                    ))}

                    {/* Logo upload */}
                    <ImagePicker
                        label="Logo"
                        hint="Displayed in the navbar and footer"
                        currentUrl={siteForm.logo}
                        onUploaded={(url) => setSiteForm((p) => ({ ...p, logo: url }))}
                        previewClass="h-12 w-24 object-contain"
                    />

                    {/* Favicon upload */}
                    <ImagePicker
                        label="Favicon"
                        hint="Square icon shown in browser tabs (PNG/ICO, 32×32 recommended)"
                        currentUrl={siteForm.favicon}
                        onUploaded={(url) => setSiteForm((p) => ({ ...p, favicon: url }))}
                        previewClass="h-10 w-10"
                    />

                    <button
                        type="submit"
                        disabled={siteLoading}
                        className="bg-black text-white px-5 py-2 rounded text-sm hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {siteLoading ? "Saving…" : "Save Site Settings"}
                    </button>
                </form>
            </div>

            {/* ── Homepage Hero Settings ───────────────────── */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Homepage Hero Settings</h2>
                {heroMsg && <p className="text-green-600 text-sm mb-3">{heroMsg}</p>}

                <form onSubmit={handleHeroSave} className="space-y-4">

                    {/* Text fields */}
                    {[
                        { label: "Hero Title", key: "title" },
                        { label: "Subtitle", key: "subtitle" },
                        { label: "Button Text", key: "buttonText" }
                    ].map((f) => (
                        <div key={f.key}>
                            <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                            <input
                                value={heroForm[f.key as keyof typeof heroForm]}
                                onChange={(e) =>
                                    setHeroForm((p) => ({ ...p, [f.key]: e.target.value }))
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                            />
                        </div>
                    ))}

                    {/* Background image upload */}
                    <ImagePicker
                        label="Background Image"
                        hint="Full-width hero banner image"
                        currentUrl={heroForm.image}
                        onUploaded={(url) => setHeroForm((p) => ({ ...p, image: url }))}
                        previewClass="h-20 w-36 object-cover"
                    />

                    <button
                        type="submit"
                        disabled={heroLoading}
                        className="bg-black text-white px-5 py-2 rounded text-sm hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {heroLoading ? "Saving…" : "Save Homepage Settings"}
                    </button>
                </form>
            </div>
        </div>
    );
}
