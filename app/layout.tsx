import "@/app/ui/global.css";
import { dmsans } from "./ui/fonts";
import { Metadata } from 'next';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmsans.className}   antialiased`}>{children}</body>
    </html>
  );
}

export const metadata: Metadata = {
  title: 'Acme Dashboard',
  description: 'The official Next.js Course Dashboard, built with App Router. Genius Clemzy mayne',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};