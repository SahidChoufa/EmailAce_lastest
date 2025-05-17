
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppLogo } from "@/components/layout/AppLogo";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Header } from "@/components/layout/Header";
import { Separator } from "@/components/ui/separator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EmailAce - Automated Application Sender",
  description: "Streamline your job application process with EmailAce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SidebarProvider defaultOpen={true} open={true}>
            <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border">
              <SidebarHeader className="h-14 sm:h-16">
                <AppLogo />
              </SidebarHeader>
              <Separator className="bg-sidebar-border" />
              <SidebarContent className="p-2">
                <SidebarNav />
              </SidebarContent>
              {/* <SidebarFooter>Footer items can go here</SidebarFooter> */}
            </Sidebar>
            <SidebarInset>
              <Header />
              <main className="flex-1 p-4 sm:p-6 bg-background overflow-auto">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
