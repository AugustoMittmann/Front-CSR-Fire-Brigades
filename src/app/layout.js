import "./globals.css";
import { Montserrat } from "next/font/google";
import { Providers } from "./home/providers";
import Header from "./components/header";
import Footer from "./components/footer";

export const metadata = {
  title: "Conexão Brigada",
  description:
    "Plataforma para encontrar e se voluntariar em brigadas de incêndio no Brasil.",
};

const montserrat = Montserrat({
  weight: ["500"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.className}>
        <Header />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}

