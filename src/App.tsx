import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/favoriteContexte";
import { OrdersProvider } from "./context/OrdersContext";
import { AddressesProvider } from "./context/AddressesContext";

import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AccountLayout } from "./components/account/AccountLayout";

import { Home } from "./views/Home";
import { ProductCatalog } from "./views/Shop";
import { SearchPage } from "./views/Search";
import { ProductDetail } from "./views/Product";
import { CartPage } from "./views/CartView";
import { FavoritesPage } from "./views/Favorite";
import { AccountFavoritesPage } from "./views/account/AccountFavorites";
import { AddressesPage } from "./views/account/Addresses";
import { AuthPage } from "./views/Auth";
import { CheckoutPage } from "./views/Checkout";
import { ProfilePage } from "./views/account/Profile";
import { OrdersPage } from "./views/account/OrdersPage";


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
          <CartProvider>
            <FavoriteProvider>
              <OrdersProvider>
                <AddressesProvider>
                  <Routes>
                    <Route path="/" element={<MainLayout />}>
                      {/* Public */}
                      <Route index element={<Home />} />
                      <Route path="/boutique" element={<ProductCatalog />} />
                      <Route path="/categories/:slug" element={<ProductCatalog />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/produit/:id" element={<ProductDetail />} />
                      <Route path="/panier" element={<CartPage />} />
                      <Route path="/favoris" element={<FavoritesPage />} />
                      <Route path="/auth" element={<AuthPage />} />

                      {/* Protégé : checkout */}
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute reason="Connectez-vous pour finaliser votre commande.">
                            <CheckoutPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Protégé : compte avec sous-routes */}
                      <Route
                        path="/compte"
                        element={
                          <ProtectedRoute reason="Connectez-vous pour accéder à votre espace.">
                            <AccountLayout />
                          </ProtectedRoute>
                        }
                      >
                        <Route index element={<ProfilePage />} />
                        <Route path="commandes" element={<OrdersPage />} />
                        <Route path="favoris" element={<AccountFavoritesPage />} />
                        <Route path="adresses" element={<AddressesPage />} />
                      </Route>
                    </Route>
                  </Routes>
                </AddressesProvider>
              </OrdersProvider>
            </FavoriteProvider>
          </CartProvider>
        </UIProvider>
      </AuthProvider>
    </Router>
  );
}