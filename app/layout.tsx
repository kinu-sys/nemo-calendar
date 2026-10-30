import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nemo Calendar - 共有カレンダー",
  description: "家族や仲間と共有できる、やさしいくすみカラーの共有カレンダー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased min-h-screen flex justify-center py-6 px-4">
        <div className="w-full max-w-[1080px]">
          {children}
        </div>
      </body>
    </html>
  );
}
