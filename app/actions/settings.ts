"use server";
// Fetches site settings and homepage settings from the DB

import { prisma } from "../lib/prisma";

export async function getSettings() {
    return prisma.setting.findFirst();
}

export async function getHomepageSettings() {
    return prisma.homepageSetting.findFirst();
}

export async function saveSettings(data: {
    siteName: string;
    email: string;
    phone: string;
    address: string;
    shippingCharge: number;
    logo?: string;
    favicon?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
}) {
    const existing = await prisma.setting.findFirst();
    if (existing) {
        return prisma.setting.update({ where: { id: existing.id }, data });
    }
    return prisma.setting.create({ data });
}

export async function saveHomepageSettings(data: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    image: string;
}) {
    const existing = await prisma.homepageSetting.findFirst();
    if (existing) {
        return prisma.homepageSetting.update({ where: { id: existing.id }, data });
    }
    return prisma.homepageSetting.create({ data });
}