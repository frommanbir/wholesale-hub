import { getOrders } from "../../actions/order";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const orders = await getOrders();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Orders</h1>
            <OrdersClient orders={orders as any} />
        </div>
    );
}
