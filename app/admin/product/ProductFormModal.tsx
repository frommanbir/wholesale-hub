"use client";
import { useState, useRef, useEffect } from "react";
import { createProduct, updateProduct } from "../../actions/product";

type Color = {
    id: number;
    name: string;
    hexCode: string;
};

type Size = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    slug: string;
    image: string;
    images?: string | null;
    price: unknown;
    discount: unknown;
    stock: number;
    status: boolean;
    description: string;
    productColors?: {
        id: number;
        productId: number;
        colorId: number;
        color: Color;
    }[];
    productSizes?: {
        id: number;
        productId: number;
        sizeId: number;
        size: Size;
    }[];
};

type ImageItem = {
    id: string;
    url?: string;
    file?: File;
    preview: string;
    isCover: boolean;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSaved: (product: Product, isEdit: boolean) => void;
    product: Product | null;
    colors: Color[];
    sizes: Size[];
};

export default function ProductFormModal({ isOpen, onClose, onSaved, product, colors, sizes }: Props) {
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        price: "",
        discount: "",
        stock: "",
        status: true,
    });

    const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
    const [selectedSizeIds, setSelectedSizeIds] = useState<number[]>([]);

    const [imagesList, setImagesList] = useState<ImageItem[]>([]);
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset or load product on open/change
    useEffect(() => {
        if (isOpen) {
            setError("");
            setUploadError("");
            if (fileInputRef.current) fileInputRef.current.value = "";

            if (product) {
                setForm({
                    name: product.name,
                    slug: product.slug,
                    description: product.description || "",
                    price: String(product.price),
                    discount: String(product.discount || 0),
                    stock: String(product.stock),
                    status: product.status,
                });

                // Load images
                let initialImages: string[] = [];
                if (product.images) {
                    try {
                        const parsed = JSON.parse(product.images);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            initialImages = parsed;
                        }
                    } catch (e) {
                        console.error("Failed to parse product.images JSON:", e);
                    }
                }
                if (initialImages.length === 0 && product.image) {
                    initialImages = [product.image];
                }

                setImagesList(
                    initialImages.map((url, idx) => ({
                        id: `existing-${idx}-${Date.now()}`,
                        url,
                        preview: url,
                        isCover: idx === 0,
                    }))
                );

                setSelectedColorIds(product.productColors?.map((pc) => pc.colorId) || []);
                setSelectedSizeIds(product.productSizes?.map((ps) => ps.sizeId) || []);
            } else {
                setForm({
                    name: "",
                    slug: "",
                    description: "",
                    price: "",
                    discount: "0",
                    stock: "",
                    status: true,
                });
                setImagesList([]);
                setSelectedColorIds([]);
                setSelectedSizeIds([]);
            }
        }
    }, [isOpen, product]);

    if (!isOpen) return null;

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "status" ? value === "true" : value,
        }));
    }

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.target.value;
        if (!product) {
            const slug = name
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
            setForm((prev) => ({ ...prev, name, slug }));
        } else {
            setForm((prev) => ({ ...prev, name }));
        }
    }

    function handleFilesSelected(files: FileList | File[]) {
        const fileArray = Array.from(files);
        if (fileArray.length === 0) return;
        setUploadError("");

        const newItems: ImageItem[] = [];
        for (const file of fileArray) {
            if (!file.type.startsWith("image/")) {
                setUploadError("Only image files are allowed.");
                continue;
            }
            if (file.size > 20 * 1024 * 1024) {
                setUploadError("Image must be under 20 MB.");
                continue;
            }
            newItems.push({
                id: Math.random().toString(36).slice(2, 9),
                file,
                preview: URL.createObjectURL(file),
                isCover: false,
            });
        }

        setImagesList((prev) => {
            const updated = [...prev, ...newItems];
            if (updated.length > 0 && !updated.some((img) => img.isCover)) {
                updated[0].isCover = true;
            }
            return updated;
        });
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            handleFilesSelected(e.target.files);
        }
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (e.dataTransfer.files) {
            handleFilesSelected(e.dataTransfer.files);
        }
    }

    function handleSetCover(id: string) {
        setImagesList((prev) =>
            prev.map((item) => ({
                ...item,
                isCover: item.id === id,
            }))
        );
    }

    function handleRemoveImage(id: string) {
        setImagesList((prev) => {
            const filtered = prev.filter((item) => item.id !== id);
            if (filtered.length > 0 && !filtered.some((item) => item.isCover)) {
                filtered[0].isCover = true;
            }
            return filtered;
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setUploadError("");

        if (imagesList.length === 0) {
            setUploadError("Please upload at least one product image.");
            return;
        }

        setLoading(true);

        try {
            const uploadedUrls: string[] = [];

            for (const item of imagesList) {
                if (item.file) {
                    const fd = new FormData();
                    fd.append("file", item.file);
                    const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
                    const uploadData = await uploadRes.json();

                    if (!uploadRes.ok || !uploadData.url) {
                        setUploadError(uploadData.error ?? "Image upload failed.");
                        setLoading(false);
                        return;
                    }
                    uploadedUrls.push(uploadData.url);
                } else if (item.url) {
                    uploadedUrls.push(item.url);
                }
            }

            // Determine cover image URL
            const coverIndex = imagesList.findIndex((item) => item.isCover);
            const coverUrl = coverIndex !== -1 ? uploadedUrls[coverIndex] : uploadedUrls[0];

            const productData: any = {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                discount: parseFloat(form.discount || "0"),
                stock: parseInt(form.stock),
                status: form.status,
                image: coverUrl,
                images: uploadedUrls,
                colorIds: selectedColorIds,
                sizeIds: selectedSizeIds,
            };

            if (!product || form.slug !== product.slug) {
                productData.slug = form.slug;
            }

            let savedProduct;
            if (product) {
                savedProduct = await updateProduct(product.id, productData);
            } else {
                savedProduct = await createProduct(productData);
            }

            onSaved(savedProduct as any, !!product);
        } catch (err: any) {
            console.error("Error saving product:", err);
            setError(err?.message || `Failed to ${product ? "update" : "create"} product. Make sure the slug is unique.`);
        }

        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px] overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                    type="button"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-xl font-semibold mb-6">
                    {product ? "Edit Product" : "Add New Product"}
                </h2>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs text-gray-500 block">Name</label>
                            <span className="text-[10px] text-gray-400">{form.name.length} / 100</span>
                        </div>
                        <input
                            required
                            name="name"
                            maxLength={100}
                            value={form.name}
                            onChange={handleNameChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs text-gray-500 block">Slug</label>
                            <span className="text-[10px] text-gray-400">{form.slug.length} / 100</span>
                        </div>
                        <input
                            required
                            name="slug"
                            maxLength={100}
                            value={form.slug}
                            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                        />
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs text-gray-500 block">Description</label>
                            <span className="text-[10px] text-gray-400">{form.description.length} / 1000</span>
                        </div>
                        <textarea
                            required
                            name="description"
                            maxLength={1000}
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black resize-none"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Price (Rs.)</label>
                        <input
                            required
                            type="number"
                            step="0.01"
                            min="0"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                        />
                    </div>

                    {/* Discount */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Discount Amount (Rs.)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="discount"
                            value={form.discount}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                        />
                    </div>

                    {/* Stock */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Stock</label>
                        <input
                            required
                            type="number"
                            min="0"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Status</label>
                        <select
                            name="status"
                            value={String(form.status)}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    {/* Color / Number Checklist */}
                    <div className="sm:col-span-2">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs text-gray-700 block font-semibold">Available Colors / Numbers</label>
                            <span className="text-[10px] text-gray-400">Select options present in product image</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((color) => {
                                const isSelected = selectedColorIds.includes(color.id);
                                return (
                                    <button
                                        key={color.id}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedColorIds((prev) => prev.filter((id) => id !== color.id));
                                            } else {
                                                setSelectedColorIds((prev) => [...prev, color.id]);
                                            }
                                        }}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition cursor-pointer select-none ${
                                            isSelected
                                                ? "border-rose-600 bg-rose-600 text-white shadow-sm"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        <span
                                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                                            style={{ backgroundColor: color.hexCode || "#000" }}
                                        />
                                        <span>{color.name}</span>
                                        {isSelected && (
                                            <svg className="w-3.5 h-3.5 text-white ml-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                            {colors.length === 0 && (
                                <p className="text-xs text-gray-400">No colors configured yet. Go to Admin Colors dashboard to add numbers (1–10) or colors.</p>
                            )}
                        </div>
                    </div>

                    {/* Size Checklist */}
                    <div className="sm:col-span-2">
                        <label className="text-xs text-gray-700 mb-2 block font-semibold">Available Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {sizes.map((size) => {
                                const isSelected = selectedSizeIds.includes(size.id);
                                return (
                                    <button
                                        key={size.id}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedSizeIds((prev) => prev.filter((id) => id !== size.id));
                                            } else {
                                                setSelectedSizeIds((prev) => [...prev, size.id]);
                                            }
                                        }}
                                        className={`flex items-center justify-center min-w-[40px] px-3.5 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition cursor-pointer select-none ${
                                            isSelected
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        <span>{size.name}</span>
                                        {isSelected && (
                                            <svg className="w-3 h-3 text-white ml-1.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                            {sizes.length === 0 && (
                                <p className="text-xs text-gray-400">No sizes configured yet. Create some in the Sizes dashboard.</p>
                            )}
                        </div>
                    </div>

                    {/* Multi-Image Upload */}
                    <div className="sm:col-span-2 space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-semibold text-gray-700 block">
                                Product Images <span className="text-gray-400 font-normal">(Select multiple files or drag & drop)</span>
                            </label>
                            <span className="text-xs text-gray-500 font-medium">
                                {imagesList.length} {imagesList.length === 1 ? "image" : "images"} uploaded
                            </span>
                        </div>

                        {/* Thumbnail Grid */}
                        {imagesList.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                {imagesList.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`relative group rounded-lg overflow-hidden border-2 transition bg-white aspect-square ${
                                            item.isCover ? "border-rose-600 ring-2 ring-rose-100" : "border-gray-200"
                                        }`}
                                    >
                                        <img
                                            src={item.preview}
                                            alt="Product thumbnail"
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Cover badge */}
                                        {item.isCover && (
                                            <span className="absolute top-1 left-1 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                                COVER
                                            </span>
                                        )}

                                        {/* Action Overlays */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1.5 p-1">
                                            {!item.isCover && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetCover(item.id)}
                                                    className="bg-white/90 text-gray-900 text-[10px] font-bold px-2 py-1 rounded hover:bg-white transition"
                                                >
                                                    Set Cover
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(item.id)}
                                                className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* File Upload Dropzone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-gray-300 hover:border-black rounded-xl p-5 text-center cursor-pointer bg-gray-50 hover:bg-white transition flex flex-col items-center justify-center gap-2"
                        >
                            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <div>
                                <p className="text-xs font-semibold text-gray-700">
                                    Click or drag & drop to add images
                                </p>
                                <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, WEBP — up to 20 MB each (Select multiple files at once)</p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>

                        {uploadError && (
                            <p className="text-red-500 text-xs mt-1">{uploadError}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="sm:col-span-2 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border border-gray-300 text-gray-700 px-5 py-2 rounded text-sm hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
