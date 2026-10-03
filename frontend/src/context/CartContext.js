import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // Persistance locale : le panier survit aux rechargements
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("zev-cart")) || [];
    } catch (e) {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("zev-cart", JSON.stringify(items));
    } catch (e) {}
  }, [items]);

  const add = (variantId, size) => {
    const key = `${variantId}-${size}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found)
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { key, variantId, size, qty: 1 }];
    });
    setOpen(true);
  };

  const setQty = (key, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.key !== key));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  };

  const remove = (key) =>
    setItems((prev) => prev.filter((i) => i.key !== key));

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, open, setOpen, add, setQty, remove, count }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
