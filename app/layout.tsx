import { Inter } from "next/font/google";
import "./globals.css";
import AuthWrapper from "./AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}