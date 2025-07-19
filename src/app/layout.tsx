import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { geistMono, geistSans } from "./fonts";
import ConvexClientProvider from "@/providers/convex-client-provider";

export const metadata: Metadata = {
    title: "Whats App",
    description: "Whats App Clone",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ConvexClientProvider>{children}</ConvexClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
