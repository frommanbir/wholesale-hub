"use client";
import { useState, useTransition } from "react";
import { createColor, deleteColor } from "../../actions/color";

type Color = { id: number; name: string; hexCode: string };

export default function ColorsClient({ initialColors }: { initialColors: Color[] }) {
    const [colors, setColors] = useState(initialColors);
    const [name, setName] = useState("");
    const [hexCode, setHexCode] = useState("#000000");
    const [loading, setLoading] = useState(false);
    const [pending, startTransition] = useTransition();

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const newColor = await createColor({ name, hexCode });
        setColors((prev) => [newColor, ...prev]);
        setName("");
        setHexCode("#000000");
        setLoading(false);
    }

    function handleDelete(id: number) {
        if (!confirm("Delete this color?")) return;
        startTransition(async () => {
            await deleteColor(id);
            setColors((prev) => prev.filter((c) => c.id !== id));
        });
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add Color Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Add Color</h2>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Color Name</label>
                        <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Royal Blue"
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block">Hex Code</label>
                        <div className="flex gap-3 items-center">
                            <input
                                type="color"
                                value={hexCode}
                                onChange={(e) => setHexCode(e.target.value)}
                                className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                            />
                            <input
                                required
                                value={hexCode}
                                onChange={(e) => setHexCode(e.target.value)}
                                placeholder="#000000"
                                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-black"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-5 py-2 rounded text-sm hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Color"}
                    </button>
                </form>
            </div>

            {/* Colors List */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">All Colors</h2>
                <div className="space-y-2">
                    {colors.map((color) => (
                        <div
                            key={color.id}
                            className="flex items-center justify-between border border-gray-100 rounded p-3"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-6 h-6 rounded-full border border-gray-200"
                                    style={{ backgroundColor: color.hexCode }}
                                />
                                <span className="text-sm font-medium">{color.name}</span>
                                <span className="text-xs text-gray-400">{color.hexCode}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(color.id)}
                                disabled={pending}
                                className="text-red-500 text-xs hover:underline disabled:opacity-50"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {colors.length === 0 && (
                        <p className="text-gray-400 text-sm text-center py-4">No colors yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
