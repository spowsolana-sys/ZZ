import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/api";

const AuthContext = createContext(null);

/* user: undefined = vérification en cours, null = non connecté, object = connecté */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    let alive = true;
    api("/auth/me")
      .then((u) => {
        if (!alive) return;
        setUser(u);
        return api("/wishlist");
      })
      .then((w) => {
        if (alive && w) setWishlist(w.products);
      })
      .catch(() => alive && setUser(null));
    return () => {
      alive = false;
    };
  }, []);

  const login = async (email, password) => {
    const u = await api("/auth/login", { method: "POST", body: { email, password } });
    setUser(u);
    try {
      const w = await api("/wishlist");
      setWishlist(w.products);
    } catch (e) {
      setWishlist([]);
    }
    return u;
  };

  const register = async (name, email, password) => {
    const u = await api("/auth/register", { method: "POST", body: { name, email, password } });
    setUser(u);
    setWishlist([]);
    return u;
  };

  const logout = async () => {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
    setWishlist([]);
  };

  const toggleWishlist = async (productId) => {
    if (!user) throw new Error("GUEST");
    const action = wishlist.includes(productId) ? "remove" : "add";
    const w = await api("/wishlist", { method: "POST", body: { product_id: productId, action } });
    setWishlist(w.products);
  };

  return (
    <AuthContext.Provider value={{ user, wishlist, login, register, logout, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
