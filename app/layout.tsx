import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <main className="flex flex-col items-center justify-center">
          <div className="w-[550px] pt-10">
            <h1 className="font-medium text-2xl pb-1 mb-4 border-b border-neutral-200">
              <Link href="/">Sudoko</Link>
            </h1>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
