"use server";
// Takes order form data and saves it to the DB, returning the order number

import { prisma } from "../lib/prisma";

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