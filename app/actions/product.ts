"use server";
// Fetches products for the homepage grid and a single product by slug

import { prisma } from "../lib/prisma";

export async function getProducts() {
    return prisma.product.findMany({
        where: { status: true },
        orderBy: { createdAt: "desc" },
    });
}

export async function getProductBySlug(slug: string) {
    const decodedSlug = decodeURIComponent(slug);
    return prisma.product.findUnique({
        where: { slug: decodedSlug },
        include: {
            productColors: {
                include: { color: true },
            },
            productSizes: {
                include: { size: true },
            },
        },
    });
}

export async function getAllProducts() {
    return prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            productColors: {
                include: { color: true },
            },
            productSizes: {
                include: { size: true },
            },
        },
    });
}

export async function createProduct(data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    discount?: number;
    stock: number;
    status: boolean;
    image: string;
    images?: string[];
    colorIds?: number[];
    sizeIds?: number[];
}) {
    const { colorIds, sizeIds, images, ...productData } = data;
    const imagesJson = images ? JSON.stringify(images) : null;
    return prisma.product.create({
        data: {
            ...productData,
            images: imagesJson,
            productColors: colorIds
                ? {
                      create: colorIds.map((colorId) => ({ colorId })),
                  }
                : undefined,
            productSizes: sizeIds
                ? {
                      create: sizeIds.map((sizeId) => ({ sizeId })),
                  }
                : undefined,
        },
        include: {
            productColors: {
                include: { color: true },
            },
            productSizes: {
                include: { size: true },
            },
        },
    });
}

export async function deleteProduct(id: number) {
    return prisma.product.delete({ where: { id } });
}

export async function updateProduct(
    id: number,
    data: {
        name: string;
        slug?: string;
        description: string;
        price: number;
        discount?: number;
        stock: number;
        status: boolean;
        image: string;
        images?: string[];
        colorIds?: number[];
        sizeIds?: number[];
    }
) {
    const { colorIds, sizeIds, images, ...productData } = data;
    const imagesJson = images ? JSON.stringify(images) : undefined;
    return prisma.product.update({
        where: { id },
        data: {
            ...productData,
            images: imagesJson,
            productColors: colorIds
                ? {
                      deleteMany: {},
                      create: colorIds.map((colorId) => ({ colorId })),
                  }
                : undefined,
            productSizes: sizeIds
                ? {
                      deleteMany: {},
                      create: sizeIds.map((sizeId) => ({ sizeId })),
                  }
                : undefined,
        },
        include: {
            productColors: {
                include: { color: true },
            },
            productSizes: {
                include: { size: true },
            },
        },
    });
}