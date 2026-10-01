import { useEffect } from "react";
import Lenis from "lenis";
import "@/App.css";
import "@/index.css";
import Hero from "@/components/Hero";

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return <Hero />;
}

export default App;
