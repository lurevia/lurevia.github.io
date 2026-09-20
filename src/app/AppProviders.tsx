import type { ReactNode } from "react";

import { AddressesProvider } from "../context/AddressesContext";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { CategoriesProvider } from "../context/CategoriesContext";
import { FeedbackProvider } from "../context/FeedbackContext";
import { FavoriteProvider } from "../context/favoriteContexte";
import { NotificationsProvider } from "../context/NotificationsContext";
import { OrdersProvider } from "../context/OrdersContext";
import { ReviewsProvider } from "../context/ReviewsContext";
import { UIProvider } from "../context/UIContext";

type AppProvidersProps = {
  children: ReactNode;
};

/**
 * Ordre des providers : `AuthProvider` englobe tout, car chaque contexte
 * de données (panier, commandes, favoris…) se recharge en fonction de la
 * session courante et doit être purgé à la déconnexion.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <UIProvider>
        <CategoriesProvider>
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
        </CategoriesProvider>
      </UIProvider>
    </AuthProvider>
  );
}
