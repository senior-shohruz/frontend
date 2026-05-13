import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Frontend Studio — Learn frontend, beautifully",
  description:
    "An AI-powered learning platform for HTML, CSS, JavaScript, and React. Build, ship, repeat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
