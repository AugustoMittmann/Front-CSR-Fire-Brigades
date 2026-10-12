import Icons from "./icons";

// Itens de navegação do site público. Fonte única de verdade das rotas do
// menu — consumida tanto pelo menu hambúrguer mobile (menuButton.js) quanto
// pela navegação horizontal do desktop (header.js).
const MENU_ITEMS = [
  { href: "/home", label: "Página Inicial", icon: Icons.globo },
  { href: "/viewBrigadesPage", label: "Visualizar Brigadas", icon: Icons.localizacao },
  { href: "/historiaPage", label: "História da RNBV", icon: Icons.livro },
  { href: "/viewCampaignsPage?tipo=campanhas", label: "Campanhas", icon: Icons.globo },
  { href: "/viewCampaignsPage?tipo=artigos", label: "Artigos e Notícias", icon: Icons.jornal },
  { href: "/contactPage", label: "Entrar em contato", icon: Icons.mailverde },
  { href: "/FAQPage", label: "Dúvidas Frequentes", icon: Icons.ajudaverde },
];

export default MENU_ITEMS;
