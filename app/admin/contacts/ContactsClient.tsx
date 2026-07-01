"use client";
import { useState, useTransition } from "react";
import { deleteContact } from "../../actions/contact";

type Contact = {
    id: number;
    name: string;
    phone: string;
    address: string;
    createdAt: Date;
};

export default function ContactsClient({ initialContacts }: { initialContacts: Contact[] }) {
    const [contacts, setContacts] = useState(initialContacts);
    const [pending, startTransition] = useTransition();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    function handleDelete(id: number) {
        if (!confirm("Are you sure you want to delete this inquiry?")) return;
        startTransition(async () => {
            await deleteContact(id);
            setContacts((prev) => prev.filter((c) => c.id !== id));
        });
    }

    const totalPages = Math.ceil(contacts.length / itemsPerPage);
    const activePage = Math.min(currentPage, Math.max(totalPages, 1));
    const paginatedContacts = contacts.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left px-4 py-3 w-12">S.N.</th>
                            <th className="text-left px-4 py-3">Date</th>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Phone</th>
                            <th className="text-left px-4 py-3">Address</th>
                            <th className="text-left px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedContacts.map((c, idx) => {
                            const serialNumber = (activePage - 1) * itemsPerPage + idx + 1;
                            return (
                                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                                    <td className="px-4 py-3 text-gray-500 font-medium">{serialNumber}</td>
                                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString()}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                                    <td className="px-4 py-3 text-gray-700">{c.phone}</td>
                                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={c.address}>
                                        {c.address}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(c.id)}
                                            disabled={pending}
                                            className="text-red-500 text-xs hover:underline disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {contacts.length === 0 && (
                <p className="text-center text-gray-400 py-10">No inquiries yet.</p>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 bg-white">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={activePage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={activePage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs text-gray-700">
                                Showing{" "}
                                <span className="font-semibold">
                                    {(activePage - 1) * itemsPerPage + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-semibold">
                                    {Math.min(activePage * itemsPerPage, contacts.length)}
                                </span>{" "}
                                of <span className="font-semibold">{contacts.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-xs -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={activePage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-xs font-medium transition ${
                                            page === activePage
                                                ? "z-10 bg-black border-black text-white"
                                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={activePage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
