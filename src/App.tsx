import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ─── Providers ───
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/favoriteContexte";
import { OrdersProvider } from "./context/OrdersContext";
import { AddressesProvider } from "./context/AddressesContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import { FeedbackProvider } from "./context/FeedbackContext";

// ─── Layout + Guards ───
import { MainLayout } from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AccountLayout } from "./components/account/AccountLayout";

// ─── Pages publiques ───
import { Home } from "./views/Home";
import { ProductCatalog } from "./views/Shop";
import { SearchPage } from "./views/Search";
import { ProductDetail } from "./views/Product";
import { CartPage } from "./views/CartView";
import { FavoritesPage } from "./views/Favorite";
import { AuthPage } from "./views/Auth";
import { ServiceFeedbackPage } from "./views/ServiceFeedbackPage";

// ─── Pages protégées ───
import { CheckoutPage } from "./views/Checkout";

// ─── Sous-pages compte ───
import { ProfilePage } from "./views/account/Profile";
import { OrdersPage } from "./views/account/OrdersPage";
import { AccountFavoritesPage } from "./views/account/AccountFavorites";
import { AddressesPage } from "./views/account/Addresses";
import { NotificationsPage } from "./views/account/NotificationsPage";
import { UserReviewsPage } from "./views/account/UserReviewsPage";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
          <CartProvider>
            <FavoriteProvider>
              <OrdersProvider>
                <AddressesProvider>
                  <ReviewsProvider>
                    <NotificationsProvider>
                      <FeedbackProvider>
                        <Routes>
                          <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            <Route path="/boutique" element={<ProductCatalog />} />
                            <Route
                              path="/categories/:slug"
                              element={<ProductCatalog />}
                            />
                            <Route path="/search" element={<SearchPage />} />
                            <Route
                              path="/produit/:id"
                              element={<ProductDetail />}
                            />
                            <Route path="/panier" element={<CartPage />} />
                            <Route path="/favoris" element={<FavoritesPage />} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route
                              path="/feedback"
                              element={<ServiceFeedbackPage />}
                            />

                            <Route
                              path="/checkout"
                              element={
                                <ProtectedRoute reason="Connectez-vous pour finaliser votre commande.">
                                  <CheckoutPage />
                                </ProtectedRoute>
                              }
                            />

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
                              <Route
                                path="favoris"
                                element={<AccountFavoritesPage />}
                              />
                              <Route
                                path="adresses"
                                element={<AddressesPage />}
                              />
                              <Route
                                path="notifications"
                                element={<NotificationsPage />}
                              />
                              <Route path="avis" element={<UserReviewsPage />} />
                            </Route>
                          </Route>
                        </Routes>
                      </FeedbackProvider>
                    </NotificationsProvider>
                  </ReviewsProvider>
                </AddressesProvider>
              </OrdersProvider>
            </FavoriteProvider>
          </CartProvider>
        </UIProvider>
      </AuthProvider>
    </Router>
  );
}