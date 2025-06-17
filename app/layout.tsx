import { Link } from "@heroui/link";
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Providers } from "./providers";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body className="flex flex-col h-screen min-h-full flex-grow">
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <AuthProvider>
            <div className="flex flex-col bg-white dark:bg-black w-[30px] rounded-full">
              <ThemeSwitch />
            </div>
            <main className="flex-grow flex items-center justify-center h-screen w-full gap-6">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3 bg-black mt-auto ">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="www.uaa.mx"
                title="UAA"
              >
                <span className="text-white">©</span>
                <p className="text-primary">Universidad Autónoma de Aguascalientes</p>
              </Link>
            </footer>
          </AuthProvider>
        </Providers>
      </body>
    </html>

  );
}

