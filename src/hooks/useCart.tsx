import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { dishById } from '../data/menu.ts';
import { readJson, writeJson } from '../lib/storage.ts';
import { orderTotal, type OrderLine } from '../lib/whatsapp.ts';
import type { Selection } from '../lib/pricing.ts';

/** What is stored: ids and indexes only, so price edits in menu.ts apply to saved carts too. */
interface StoredLine extends Selection {
  key: string;
  dishId: string;
  qty: number;
}

export interface CartLine extends OrderLine {
  key: string;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  total: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (dishId: string, selection: Selection, qty: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'thailandi:cart';
const MAX_QTY = 50;

function lineKey(dishId: string, sel: Selection): string {
  return [dishId, sel.sizeIndex ?? '-', [...sel.extras].sort((a, b) => a - b).join('.')].join('|');
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Empty on first render to match the prerendered HTML; the saved cart loads after hydration.
  const [stored, setStored] = useState<StoredLine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setStored(readJson<StoredLine[]>(STORAGE_KEY, []));
    setLoaded(true);
  }, []);

  // Only write once loaded, so the empty initial state never overwrites a saved cart.
  useEffect(() => {
    if (loaded) writeJson(STORAGE_KEY, stored);
  }, [stored, loaded]);

  const add = useCallback((dishId: string, selection: Selection, qty: number) => {
    const key = lineKey(dishId, selection);
    setStored((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) return prev.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      return [...prev, { key, dishId, qty, sizeIndex: selection.sizeIndex, extras: selection.extras }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setStored((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => setStored((prev) => prev.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setStored([]), []);

  const value = useMemo<CartContextValue>(() => {
    // Drop lines whose dish was removed from the menu since they were saved.
    const lines = stored.flatMap((l) => {
      const dish = dishById.get(l.dishId);
      return dish ? [{ key: l.key, dish, qty: l.qty, sizeIndex: l.sizeIndex, extras: l.extras ?? [] }] : [];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: orderTotal(lines),
      isOpen,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    };
  }, [stored, isOpen, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
