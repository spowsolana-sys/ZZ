import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

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

  const remove = (key) =>
    setItems((prev) => prev.filter((i) => i.key !== key));

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{ items, open, setOpen, add, remove, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
