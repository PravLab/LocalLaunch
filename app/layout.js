import { Geist, Geist_Mono } from "next/font/google";
import { baloo, poppins, rubik } from "@/src/font";
import { BusinessProvider } from "@/src/context/BusinessContext";
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/src/context/AuthContext";
//import { AdminModalProvider } from '@/components/AdminLoginModal';
import "./globals.css";
import "swiper/css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export const metadata = {
  title: "Local Launch",
  description: "Local Launch helps businesses go online with their own storefront instantly. Launch now!",
  icons: {
   icon: "/favicon.ico",
 },
  keywords: ["Local Launch", "online storefront", "digital dukaan", "local business website", "small business marketing"],
  authors: [{ name: "Praveen" }],
  creator: "Local Launch Team",
  robots: "index, follow",
  openGraph: {
    title: "Local Launch | Go Online Instantly",
    description: "Launch your business online in seconds with your own mini-site.",
    url: "https://locallaunch.in",
    siteName: "Local Launch",
    images: [
      {
        url: "/og-cover.png", // optional image for link previews
        width: 1200,
        height: 630,
        alt: "Local Launch",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};


export default  function RootLayout({ children, params }) {
  const { slug } = params;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#000000" />
<link rel="apple-touch-icon" href="/logo.png" />

      </head>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} scrollbar-hide antialiased overflow-y-scroll`}
      >
        <div id="modal-root"></div>

        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
          <AuthProvider>
             <BusinessProvider slug={slug}>
            <Toaster richColors position="top-center" />
            {children}
          </BusinessProvider>
          </AuthProvider>
         
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

