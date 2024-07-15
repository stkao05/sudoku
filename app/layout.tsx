import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sudoku",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono">
        <main className="flex flex-col items-center justify-center bg-neutral-100">
          <div className="w-full sm:w-[600px] h-screen px-6 pt-4 bg-white">
            <h1 className="font-medium text-xl mb-4">
              <Link href="/">sudoko</Link>
            </h1>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
