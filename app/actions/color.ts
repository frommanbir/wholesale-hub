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

export async function createNumberColors(start: number = 1, count: number = 10) {
    const defaultColors = [
        "#E53E3E", "#DD6B20", "#D69E2E", "#38A169", "#319795",
        "#3182CE", "#805AD5", "#D53F8C", "#4A5568", "#2D3748"
    ];
    const newColors = [];
    for (let i = 0; i < count; i++) {
        const num = start + i;
        const colorName = `Number ${num}`;
        const existing = await prisma.color.findFirst({
            where: { name: colorName }
        });
        if (!existing) {
            const created = await prisma.color.create({
                data: {
                    name: colorName,
                    hexCode: defaultColors[i % defaultColors.length]
                }
            });
            newColors.push(created);
        }
    }
    return newColors;
}

