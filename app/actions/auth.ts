"use server";
// Auth actions: register customer, login (role-based), logout

import { prisma } from "../lib/prisma";
import { setSession, clearSession } from "../lib/session";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function registerUser(data: {
    name: string;
    phone: string;
    password: string;
    address: string;
}) {
    const existing = await prisma.user.findUnique({
        where: { phone: data.phone },
    });
    if (existing) {
        return { success: false, message: "Phone number already registered." };
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    await prisma.user.create({
        data: { 
            ...data, 
            password: hashedPassword,
            role: "customer" 
        },
    });
    return { success: true };
}

export async function loginUser(data: {
    phone: string;
    password: string;
}) {
    const user = await prisma.user.findUnique({
        where: { phone: data.phone },
    });

    if (!user) {
        return { success: false, message: "Invalid phone number or password." };
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
        return { success: false, message: "Invalid phone number or password." };
    }

    // Set session cookie with role
    await setSession({
        id: user.id,
        name: user.name,
        role: user.role as "admin" | "customer",
    });

    return { success: true, role: user.role };
}

export async function logoutUser() {
    await clearSession();
    redirect("/login");
}