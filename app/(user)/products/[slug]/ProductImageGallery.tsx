"use client";
import { useState } from "react";

type Props = {
    images: string[];
    productName: string;
};

export default function ProductImageGallery({ images, productName }: Props) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const safeImages = images.length > 0 ? images : ["/placeholder.jpg"];
    const currentImage = safeImages[selectedIndex] || safeImages[0];

    return (
        <div className="flex flex-col gap-3">
            {/* Main Featured Image */}
            <div className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm group flex items-center justify-center min-h-[360px] max-h-[560px] p-2">
                <img
                    src={currentImage}
                    alt={productName}
                    className="w-full h-full max-h-[540px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                />

                {/* Zoom / Lightbox Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsZoomed(true)}
                    className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-md backdrop-blur-xs transition transform hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold px-3"
                    title="Click to view full screen zoom"
                >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    <span>Zoom & View Numbers</span>
                </button>

                {/* Image Count Badge */}
                {safeImages.length > 1 && (
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {selectedIndex + 1} / {safeImages.length}
                    </span>
                )}
            </div>

            {/* Thumbnail Row */}
            {safeImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-gray-300">
                    {safeImages.map((img, idx) => {
                        const isSelected = idx === selectedIndex;
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedIndex(idx)}
                                className={`relative w-20 h-24 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                                    isSelected
                                        ? "border-rose-600 ring-2 ring-rose-100 scale-105"
                                        : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
                                }`}
                            >
                                <img
                                    src={img}
                                    alt={`${productName} thumbnail ${idx + 1}`}
                                    className="w-full h-full object-contain p-0.5 bg-gray-50"
                                />
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Fullscreen Zoom Lightbox Modal */}
            {isZoomed && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={() => setIsZoomed(false)}
                >
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={() => setIsZoomed(false)}
                        className="absolute top-5 right-5 text-white hover:text-gray-300 p-2 rounded-full bg-white/10 transition z-50"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center p-2" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={currentImage}
                            alt={productName}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />

                        {/* Navigation Arrows inside Lightbox */}
                        {safeImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : safeImages.length - 1))}
                                    className="absolute left-2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition"
                                >
                                    ❮
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedIndex((prev) => (prev < safeImages.length - 1 ? prev + 1 : 0))}
                                    className="absolute right-2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-sm transition"
                                >
                                    ❯
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
