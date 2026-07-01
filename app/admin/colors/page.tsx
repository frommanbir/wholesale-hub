import { getColors } from "../../actions/color";
import ColorsClient from "./ColorsClient";

export default async function AdminColorsPage() {
    const colors = await getColors();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Colors</h1>
            <ColorsClient initialColors={colors} />
        </div>
    );
}
