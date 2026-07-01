import { getContacts } from "../../actions/contact";
import ContactsClient from "./ContactsClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Wholesale partner Inquiries — Admin Panel",
};

export default async function AdminContactsPage() {
    const contacts = await getContacts();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Wholesale Inquiries</h1>
            <ContactsClient initialContacts={contacts} />
        </div>
    );
}
