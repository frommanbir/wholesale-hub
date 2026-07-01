"use server";
// Color server actions for admin panel

import { prisma } from "../lib/prisma";

export async function getColors() {
    return prisma.color.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createColor(data: { name: string; hexCode: string }) {
    return prisma.color.create({ data });
}

export async function deleteColor(id: number) {
    return prisma.color.delete({ where: { id } });
}

export async function updateColor(id: number, data: { name: string; hexCode: string }) {
    return prisma.color.update({
        where: { id },
        data,
    });
}
