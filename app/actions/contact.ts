"use server";
// Contact inquiry server actions for wholesale partners

import { prisma } from "../lib/prisma";

export async function createContact(data: {
    name: string;
    phone: string;
    address: string;
}) {
    return prisma.contact.create({ data });
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
