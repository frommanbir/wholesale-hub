import { getSettings, getHomepageSettings } from "../../actions/settings";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
    const [settings, homepage] = await Promise.all([
        getSettings(),
        getHomepageSettings(),
    ]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <SettingsClient settings={settings} homepage={homepage} />
        </div>
    );
}