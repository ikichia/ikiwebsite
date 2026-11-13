import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { Footer, Header, MobileContact } from "@/components/site";
import { isLocale, locales } from "@/lib/site";
import "../globals.css";

const inter = localFont({
  src: "../../fonts/inter-latin.woff2",
  weight: "400 700",
  variable: "--font-inter",
  preload: false,
});

const notoSans = localFont({
  src: "../../fonts/noto-sans-sc-site.woff2",
  weight: "400 700",
  variable: "--font-noto-sans",
  preload: false,
  adjustFontFallback: false,
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { default: "Property with Iki", template: "%s | Property with Iki" },
    description: lang === "zh" ? "Iki Chia 的柔佛房地产网站。" : "Johor property guidance from Iki Chia.",
    icons: {
      icon: [
        { url: "/favicon.ico?v=iki-20261113-final", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
        { url: "/favicon-16x16.png?v=iki-20261113-final", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png?v=iki-20261113-final", sizes: "32x32", type: "image/png" },
        { url: "/favicon-192x192.png?v=iki-20261113-final", sizes: "192x192", type: "image/png" },
        { url: "/favicon-512x512.png?v=iki-20261113-final", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png?v=iki-20261113-final", sizes: "180x180", type: "image/png" }],
    },
  };
}

export default async function Layout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang === "zh" ? "zh-Hans" : "en-MY"} className={lang === "zh" ? notoSans.variable : inter.variable}>
      <body>
        <div className="site-content"><Header lang={lang} />{children}<Footer lang={lang} /></div>
        <MobileContact lang={lang} />
      </body>
    </html>
  );
}
