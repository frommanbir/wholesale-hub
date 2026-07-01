import { getSettings, getHomepageSettings } from "../../actions/settings";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
    const [settings, homepage] = await Promise.all([
        getSettings(),
        getHomepageSettings(),
    ]);

    const serializedSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <SettingsClient settings={serializedSettings} homepage={homepage} />
        </div>
    );
}