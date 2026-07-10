import { getAllProducts } from "../../actions/product";
import { getColors } from "../../actions/color";
import { getSizes } from "../../actions/size";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
    const [products, colors, sizes] = await Promise.all([
        getAllProducts(),
        getColors(),
        getSizes(),
    ]);

    // Serialize Decimal/Date objects to plain JSON-compatible types
    const serializedProducts = JSON.parse(JSON.stringify(products));

    return <ProductsClient initialProducts={serializedProducts} colors={colors} sizes={sizes} />;
}
