import "./globals.css";
import { Montserrat } from "next/font/google";
import { Providers } from "./providers";

export const metadata = {
  title: "Conexão Brigada",
  description:
    "Plataforma para encontrar e se voluntariar em brigadas de incêndio no Brasil.",
};

const montserrat = Montserrat({
  weight: ["500"],
  subsets: ["latin"],
});

// Root layout stays minimal: html/body + Auth0 provider. Public and admin
// route groups render their own chrome (header/footer or sidebar) so they can
// diverge freely without CSS hacks. Every page still gets Auth0 context.
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={montserrat.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
