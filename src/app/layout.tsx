import type { Metadata } from "next";
import { Orbitron, Poppins } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins" 
});

export const metadata: Metadata = {
  title: "BoostTrack | Trusted Game Boosting SaaS",
  description: "Turn your joki business into a professional, automated platform with built-in trust and tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.filename && (e.filename.includes('inpage.js') || e.filename.includes('metamask'))) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body className={`${orbitron.variable} ${poppins.variable} font-sans bg-void text-white selection:bg-neonGreen/30 antialiased`}>
        {children}
      </body>
    </html>
  )
}
