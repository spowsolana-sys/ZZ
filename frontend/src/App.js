import { useEffect, Component } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Home from "@/pages/Home";
import Catalogue from "@/pages/Catalogue";
import Product from "@/pages/Product";
import Suivi from "@/pages/Suivi";
import CategoryPage from "@/pages/Categories";
import Compte from "@/pages/Compte";
import Checkout from "@/pages/Checkout";
import { Livraison, Retours, APropos, Faq, Contact } from "@/pages/Pages";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error)
      return (
        <div className="min-h-screen bg-white text-black flex items-center justify-center font-tech text-xs tracking-[0.3em]">
          UNE ERREUR EST SURVENUE — RECHARGEZ LA PAGE
        </div>
      );
    return this.props.children;
  }
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/* Transition douce entre les pages — key au niveau page uniquement :
   /produit/noir -> /produit/blanche ne remonte PAS la page (le carrousel
   de variantes reste monté et joue sa propre transition). */
function PageTransition() {
  const { pathname } = useLocation();
  const pageKey = "/" + pathname.split("/")[1];
  return (
    <motion.div
      key={pageKey}
      id="page-transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="contents"
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/categorie/:slug" element={<CategoryPage />} />
        <Route path="/produit/:id" element={<Product />} />
        <Route path="/suivi" element={<Suivi />} />
        <Route path="/compte" element={<Compte />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/livraison" element={<Livraison />} />
        <Route path="/retours" element={<Retours />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <CartDrawer />
    </motion.div>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <ScrollToTop />
          <AuthProvider>
            <Header />
            <PageTransition />
          </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          style: {
            background: "#0A0A0A",
            color: "#fff",
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            letterSpacing: "0.1em",
          },
        }}
      />
    </CartProvider>
  );
}

export default App;
