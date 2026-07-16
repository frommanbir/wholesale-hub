import type { Metadata } from "next";
import "./globals.css";
import { getSettings } from "./actions/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings?.siteName ?? "Wholesale Hub",
    description: "Premium Wholesale Products for Retailers & Businesses",
    icons: {
      icon: settings?.favicon ?? "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="antialiased"
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
