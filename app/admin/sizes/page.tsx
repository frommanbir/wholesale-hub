import { getSizes } from "../../actions/size";
// Import the Client-side sizes component
import SizesClient from "./SizesClient";

export const dynamic = "force-dynamic";

export default async function AdminSizesPage() {
    const sizes = await getSizes();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Sizes</h1>
            <SizesClient initialSizes={sizes} />
        </div>
    );
}
