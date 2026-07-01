import { getAllProducts } from "../../actions/product";
import { getColors } from "../../actions/color";
import ProductsClient from "./ProductsClient";

export default async function AdminProductsPage() {
    const [products, colors] = await Promise.all([
        getAllProducts(),
        getColors(),
    ]);

    return <ProductsClient initialProducts={products as any} colors={colors} />;
}
