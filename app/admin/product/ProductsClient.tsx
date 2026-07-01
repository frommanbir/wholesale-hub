"use client";
import { useState } from "react";
import ProductTable from "./ProductTable";
import ProductFormModal from "./ProductFormModal";

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
};

type Color = {
    id: number;
    name: string;
    hexCode: string;
};

export default function ProductsClient({
    initialProducts,
    colors,
}: {
    initialProducts: Product[];
    colors: Color[];
}) {
    const [products, setProducts] = useState(initialProducts);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    function handleDelete(id: number) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    }

    function handleSaved(savedProduct: Product, isEdit: boolean) {
        if (isEdit) {
            setProducts((prev) =>
                prev.map((p) => (p.id === savedProduct.id ? savedProduct : p))
            );
        } else {
            setProducts((prev) => [savedProduct, ...prev]);
        }
        setIsFormOpen(false);
        setEditingProduct(null);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setIsFormOpen(true);
                    }}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                    Add Product
                </button>
            </div>

            <ProductTable
                products={products}
                onEdit={(p) => {
                    setEditingProduct(p);
                    setIsFormOpen(true);
                }}
                onDelete={handleDelete}
            />

            <ProductFormModal
                isOpen={isFormOpen}
                product={editingProduct}
                colors={colors}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingProduct(null);
                }}
                onSaved={handleSaved}
            />
        </div>
    );
}
