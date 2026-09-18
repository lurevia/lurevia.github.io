import type { ReactNode } from "react";

import { AddressesProvider } from "../context/AddressesContext";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { FeedbackProvider } from "../context/FeedbackContext";
import { FavoriteProvider } from "../context/favoriteContexte";
import { NotificationsProvider } from "../context/NotificationsContext";
import { OrdersProvider } from "../context/OrdersContext";
import { ReviewsProvider } from "../context/ReviewsContext";
import { UIProvider } from "../context/UIContext";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <UIProvider>
        <CartProvider>
          <FavoriteProvider>
            <OrdersProvider>
              <AddressesProvider>
                <ReviewsProvider>
                  <NotificationsProvider>
                    <FeedbackProvider>{children}</FeedbackProvider>
                  </NotificationsProvider>
                </ReviewsProvider>
              </AddressesProvider>
            </OrdersProvider>
          </FavoriteProvider>
        </CartProvider>
      </UIProvider>
    </AuthProvider>
  );
}
