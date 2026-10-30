import { strings } from '../data/i18n.ts';
import type { Dish } from '../data/menu.ts';
import { site } from '../data/site.ts';
import { formatPrice, selectedExtras, selectedSize, unitPrice, type Selection } from './pricing.ts';

/** Messages always go to the restaurant in Arabic, whatever language the visitor browses in. */
const w = strings.ar.whatsapp;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export interface OrderLine extends Selection {
  dish: Dish;
  qty: number;
}

export interface OrderDetails {
  name?: string;
  notes?: string;
}

function describeLine(line: OrderLine, index: number | null): string[] {
  const { dish, qty } = line;
  const size = selectedSize(dish, line);
  const extras = selectedExtras(dish, line);
  const unit = unitPrice(dish, line);
  const title = `${index === null ? '•' : `${index + 1})`} ${dish.nameAr}${size ? ` — ${size.label}` : ''}`;
  const price = unit > 0 ? `${qty} × ${formatPrice(unit)} = ${formatPrice(unit * qty)}` : `${qty} (${w.priceOnRequest})`;
  const out = [title, `   ${w.qty}: ${price}`];
  if (extras.length) {
    out.push(`   ${w.extras}: ${extras.map((e) => (e.price > 0 ? `${e.label} (+${formatPrice(e.price)})` : e.label)).join('، ')}`);
  }
  return out;
}

export function orderTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, l) => sum + unitPrice(l.dish, l) * l.qty, 0);
}

/** One readable message for the whole order, ready to send on WhatsApp. */
export function buildOrderMessage(lines: OrderLine[], details: OrderDetails = {}): string {
  const single = lines.length === 1;
  const parts = [w.greeting, single ? `${w.single}:` : w.intro, ''];
  lines.forEach((line, i) => parts.push(...describeLine(line, single ? null : i)));

  const total = orderTotal(lines);
  const hasUnpriced = lines.some((l) => unitPrice(l.dish, l) === 0);
  parts.push('');
  if (total > 0) parts.push(`${w.total}: ${formatPrice(total)}${hasUnpriced ? ` + ${w.priceOnRequest}` : ''}`);
  if (details.name?.trim()) parts.push(`${w.name}: ${details.name.trim()}`);
  if (details.notes?.trim()) parts.push(`${w.notes}: ${details.notes.trim()}`);
  parts.push('', w.thanks);
  return parts.join('\n');
}
