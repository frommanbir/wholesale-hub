"use server";
// Contact inquiry server actions for wholesale partners

import { prisma } from "../lib/prisma";
import { checkRateLimit, getClientIp } from "../lib/rateLimit";

export async function createContact(data: {
    name: string;
    phone: string;
    address: string;
}) {
    const ip = await getClientIp();
    const { success, reset } = await checkRateLimit(`contact:${ip}`, 3, 60);
    if (!success) {
        return { success: false, message: `Too many inquiries. Please try again in ${reset} seconds.` };
    }

    try {
        const contact = await prisma.contact.create({ data });
        return { success: true, data: contact };
    } catch {
        return { success: false, message: "Failed to submit inquiry. Please try again." };
    }
}

export async function getContacts() {
    return prisma.contact.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function deleteContact(id: number) {
    return prisma.contact.delete({
        where: { id },
    });
}
