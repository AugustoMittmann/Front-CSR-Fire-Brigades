import "./globals.css";
import { Montserrat } from 'next/font/google';
import { Providers } from "./home/providers";
import Header from "./components/header";
import Footer from "./components/footer";

export const metadata = {
  title: "Conexão Brigada",
};

const font = Montserrat({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Header />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
