"use client";
import { useState, useRef, useEffect } from "react";
import { createProduct, updateProduct } from "../../actions/product";

type Color = {
    id: number;
    name: string;
    hexCode: string;
};

type Product = {
    id: number;
    name: string;
    slug: string;
    image: string;
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
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSaved: (product: Product, isEdit: boolean) => void;
    product: Product | null;
    colors: Color[];
};

export default function ProductFormModal({ isOpen, onClose, onSaved, product, colors }: Props) {
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

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Reset or load product on open/change
    useEffect(() => {
        if (isOpen) {
            setError("");
            setUploadError("");
            setImageFile(null);
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
                setPreview(product.image);
                setSelectedColorIds(product.productColors?.map((pc) => pc.colorId) || []);
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
                setPreview("");
                setSelectedColorIds([]);
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
        // Auto-generate slug from name if not editing
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

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError("");

        if (!file.type.startsWith("image/")) {
            setUploadError("Only image files are allowed.");
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            setUploadError("Image must be under 20 MB.");
            return;
        }

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const syntheticEvent = {
            target: { files: [file] },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(syntheticEvent);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setUploadError("");

        if (!product && !imageFile) {
            setUploadError("Please select a product image.");
            return;
        }

        setLoading(true);

        try {
            let imageUrl = product?.image ?? "";

            if (imageFile) {
                const fd = new FormData();
                fd.append("file", imageFile);
                const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
                const uploadData = await uploadRes.json();

                if (!uploadRes.ok || !uploadData.url) {
                    setUploadError(uploadData.error ?? "Image upload failed.");
                    setLoading(false);
                    return;
                }
                imageUrl = uploadData.url;
            }

            const productData: any = {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                discount: parseFloat(form.discount || "0"),
                stock: parseInt(form.stock),
                status: form.status,
                image: imageUrl,
                colorIds: selectedColorIds,
            };

            // Only send slug if creating a new product or if it has actually changed
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
                        <label className="text-xs text-gray-500 mb-1 block">Name</label>
                        <input
                            required
                            name="name"
                            value={form.name}
                            onChange={handleNameChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Slug</label>
                        <input
                            required
                            name="slug"
                            value={form.slug}
                            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                        />
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-2">
                        <label className="text-xs text-gray-500 mb-1 block">Description</label>
                        <textarea
                            required
                            name="description"
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

                    {/* Color Checklist */}
                    <div className="sm:col-span-2">
                        <label className="text-xs text-gray-500 mb-2 block font-medium">Available Colors</label>
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
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition cursor-pointer select-none ${
                                            isSelected
                                                ? "border-black bg-black text-white"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        <span
                                            className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                                            style={{ backgroundColor: color.hexCode }}
                                        />
                                        <span>{color.name}</span>
                                        {isSelected && (
                                            <svg className="w-3 h-3 text-white ml-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                            {colors.length === 0 && (
                                <p className="text-xs text-gray-400">No colors configured yet. Create some in the Colors dashboard.</p>
                            )}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="sm:col-span-2">
                        <label className="text-xs text-gray-500 mb-1 block">
                            Product Image <span className="text-gray-400">(max 5 MB)</span>
                        </label>

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                preview
                                    ? "border-gray-300 bg-gray-50"
                                    : "border-gray-300 hover:border-black bg-gray-50 hover:bg-white"
                            }`}
                            style={{ minHeight: "140px" }}
                        >
                            {preview ? (
                                <div className="flex items-start gap-4 p-4">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="h-28 w-28 object-cover rounded border border-gray-200 shrink-0"
                                    />
                                    <div className="flex flex-col justify-between h-28 py-1">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                                {imageFile ? imageFile.name : "Current Image"}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {imageFile ? (imageFile.size / 1024).toFixed(0) + " KB" : ""}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImageFile(null);
                                                setPreview("");
                                                setUploadError("");
                                                if (fileInputRef.current) fileInputRef.current.value = "";
                                            }}
                                            className="text-xs text-red-500 hover:underline text-left"
                                        >
                                            Remove image
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-8 text-gray-400">
                                    <svg
                                        className="w-8 h-8 mb-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                                        />
                                    </svg>
                                    <p className="text-sm font-medium text-gray-600">
                                        Click or drag & drop to upload
                                    </p>
                                    <p className="text-xs mt-1">PNG, JPG, WEBP — up to 5 MB</p>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="sr-only"
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
