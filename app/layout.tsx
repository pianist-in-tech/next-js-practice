// this is root layout. Any UI added here will be shared across all pages of the app. 

import '@/app/ui/global.css';
//add inter font for it to be applied thoughout the application
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
