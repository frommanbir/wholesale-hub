"use server";
// Size server actions for admin panel

import { prisma } from "../lib/prisma";

export async function getSizes() {
    return prisma.size.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createSize(data: { name: string }) {
    return prisma.size.create({ data });
}

export async function deleteSize(id: number) {
    return prisma.size.delete({ where: { id } });
}

export async function updateSize(id: number, data: { name: string }) {
    return prisma.size.update({
        where: { id },
        data,
    });
}
