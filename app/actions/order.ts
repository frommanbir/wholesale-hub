"use server";
// Takes order form data and saves it to the DB, returning the order number

import { prisma } from "../lib/prisma";
import { readFileSync } from "fs";
import path from "path";

type PlaceOrderInput = {
    customerName: string;
    phone: string;
    address: string;
    productId: number;
    colorId: number | null;
    sizeId: number | null;
    quantity: number;
    price: number;
    shippingCharge: number;
    paymentMethod: string;
    advancePaid: number;
    paymentProof: string | null;
};

// Helper function to send Telegram message
async function sendTelegramNotification(orderId: number) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
        console.warn("Telegram bot token or Chat ID is missing in .env");
        return;
    }
    try {
        // 1. Fetch complete order details including relations
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                orderItems: {
                    include: {
                        product: true,
                        color: true,
                        size: true,
                    },
                },
            },
        });
        if (!order || order.orderItems.length === 0) return;
        const firstItem = order.orderItems[0];
        const productName = firstItem.product.name;
        const colorName = firstItem.color?.name || "N/A";
        const sizeName = firstItem.size?.name || "N/A";
        // 2. Format details into HTML
        const caption = `
🛒 <b>Order Placed Successfully!</b>
<b>Order Number:</b> <code>${order.orderNumber}</code>
📦 <b>Product:</b> ${productName}
💰 <b>Total:</b> NPR ${order.total}/-
💵 <b>Advance Paid:</b> NPR ${order.advancePaid}/-
🚚 <b>Remaining COD:</b> NPR ${Number(order.total) - Number(order.advancePaid)}/-
🔢 <b>Quantity:</b> ${firstItem.quantity}
🎨 <b>Color:</b> ${colorName}
📏 <b>Size:</b> ${sizeName}
💳 <b>Payment:</b> ${order.paymentMethod}
👤 <b>Customer Details:</b>
• <b>Name:</b> ${order.customerName}
• <b>Phone:</b> ${order.phone}
• <b>Address:</b> ${order.address}
        `.trim();
        // 3. If there is a payment proof image, upload it
        if (order.paymentProof) {
            // Reconstruct local path (e.g. /uploads/filename.webp -> C:/workspace/uploads/filename.webp)
            const absoluteFilePath = path.join(process.cwd(), order.paymentProof);
            const fileBuffer = readFileSync(absoluteFilePath);
            
            const formData = new FormData();
            formData.append("chat_id", chatId);
            
            // Convert Buffer to standard Blob for web-native fetch upload
            const fileBlob = new Blob([fileBuffer], { type: "image/webp" });
            formData.append("photo", fileBlob, path.basename(absoluteFilePath));
            formData.append("caption", caption);
            formData.append("parse_mode", "HTML");
            const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) {
                const errText = await res.text();
                console.error("Telegram API Error (Photo):", errText);
            }
        } else {
            // 4. Fallback to normal text message if no payment proof is uploaded
            const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: caption,
                    parse_mode: "HTML",
                }),
            });
            if (!res.ok) {
                const errText = await res.text();
                console.error("Telegram API Error (Text):", errText);
            }
        }
    } catch (error) {
        console.error("Failed to send Telegram notification:", error);
    }
}

export async function placeOrder(data: PlaceOrderInput) {
    const subtotal = data.price * data.quantity;
    const total = subtotal + data.shippingCharge;

    // Generate a random order number like ORD-20240630-4821
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;

    const order = await prisma.order.create({
        data: {
            orderNumber,
            customerName: data.customerName,
            phone: data.phone,
            address: data.address,
            subtotal,
            shippingCharge: data.shippingCharge,
            total,
            paymentMethod: data.paymentMethod,
            advancePaid: data.advancePaid,
            paymentProof: data.paymentProof,
            status: "pending",
            orderItems: {
                create: {
                    productId: data.productId,
                    colorId: data.colorId,
                    sizeId: data.sizeId,
                    quantity: data.quantity,
                    price: data.price,
                    total: subtotal,
                },
            },
        },
    });

    sendTelegramNotification(order.id);

    return { success: true, orderNumber: order.orderNumber };
}

export async function getOrders() {
    return prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            orderItems: {
                include: {
                    product: true,
                    color: true,
                    size: true,
                },
            },
        },
    });
}

export async function updateOrderStatus(id: number, status: string) {
    return prisma.order.update({ where: { id }, data: { status } });
}

export async function deleteOrder(id: number) {
    return prisma.order.delete({ where: { id } });
}

