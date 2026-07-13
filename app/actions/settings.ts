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
    email?: string;
    phone?: string;
    address?: string;
    shippingCharge: number;
    logo?: string;
    favicon?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    qrImage?: string;
}) {
    // Convert empty strings to null for optional fields
    const toNull = (v?: string) => (v && v.trim() !== "" ? v : null);

    const payload = {
        siteName: data.siteName,
        email: data.email?.trim() || "",
        phone: data.phone?.trim() || "",
        address: data.address?.trim() || "",
        shippingCharge: data.shippingCharge,
        logo: toNull(data.logo),
        favicon: toNull(data.favicon),
        facebook: toNull(data.facebook),
        instagram: toNull(data.instagram),
        twitter: toNull(data.twitter),
        qrImage: toNull(data.qrImage),
    };

    const existing = await prisma.setting.findFirst();
    if (existing) {
        await prisma.setting.update({ where: { id: existing.id }, data: payload });
    } else {
        await prisma.setting.create({ data: payload });
    }
    return { success: true };
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
        await prisma.homepageSetting.update({ where: { id: existing.id }, data });
    } else {
        await prisma.homepageSetting.create({ data });
    }
    return { success: true };
}