// app/layout.js
import "./globals.css";
import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  metadataBase: new URL("https://alrahmamoske.se"), // Your actual domain
  title: "Al-Rahma Moské Västerås | Islamiskt Kulturcenter",
  description: "Al-Rahma Moskén i Västerås - En plats för bön, gemenskap och kunskap. Fredagsbön, koranskola, och islamiska aktiviteter. Alla är välkomna.",
  keywords: ["moské", "Västerås", "islam", "bön", "ramadan", "fredagsbön", "koranskola", "Al-Rahma"],
  authors: [{ name: "Al-Rahma Moské" }],
  openGraph: {
    title: "Al-Rahma Moské Västerås",
    description: "Islamiskt kulturcenter i Västerås - Bön, utbildning och gemenskap",
    url: "https://alrahmamoske.se",
    siteName: "Al-Rahma Moské",
    locale: "sv_SE",
    type: "website",
    images: [
      {
        url: "/android-chrome-512x512.png", // Using existing logo
        width: 512,
        height: 512,
        alt: "Al-Rahma Moské Västerås Logo",
      },
    ],
  },
  twitter: {
    card: "summary", // Changed to summary since logo is square
    title: "Al-Rahma Moské Västerås",
    description: "Islamiskt kulturcenter i Västerås",
    images: ["/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    apple: "/apple-touch-icon.png",
    android: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv" className={poppins.variable}>
      <head>
        {/* Additional meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e40af" />
        <link rel="canonical" href="https://alrahmamoske.se" />
      </head>
      <body className="bg-lighter text-main flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
