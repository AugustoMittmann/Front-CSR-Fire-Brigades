import Header from "../components/header";
import Footer from "../components/footer";

// Layout for the public site. The (public) segment is a route group — it does
// NOT appear in the URL — so /home, /viewBrigadesPage, /FAQPage, etc. keep
// their existing paths, but inherit this header/footer chrome. Admin pages
// (src/app/admin/*) sit outside this group and render their own shell.
export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
