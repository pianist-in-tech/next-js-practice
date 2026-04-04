import '@/app/ui/global.css';
//add inter font for it to be applied thoughout the application
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // the Tailwind antialiased class smooths out the font
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
