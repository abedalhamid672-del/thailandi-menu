import { StrictMode } from 'react';
import App from './App.tsx';
import { CartProvider } from './hooks/useCart.tsx';
import { LocaleProvider } from './hooks/useLocale.tsx';

/** Shared by the browser entry and the build-time prerender, so both render the same tree. */
export function Root() {
  return (
    <StrictMode>
      <LocaleProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LocaleProvider>
    </StrictMode>
  );
}
