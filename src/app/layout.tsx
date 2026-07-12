import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Layout/Sidebar";
import KyraChat from "@/components/EveChat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Studio OS",
  description: "All-in-one operating system for creative studios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen">
          <Sidebar />
          <main 
            className="flex-1 overflow-y-auto bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/images/bg.png)' }}
          >
            <div className="bg-background/80 min-h-full">
              {children}
            </div>
          </main>
        </div>
        <KyraChat />
      </body>
    </html>
  );
}