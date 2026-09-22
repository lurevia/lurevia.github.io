import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AppProviders } from "./app/AppProviders";
import { AccountLayout } from "./components/account/AccountLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";

const Home = lazy(() => import("./views/Home").then((module) => ({ default: module.Home })));
const ProductCatalog = lazy(() =>
  import("./views/Shop").then((module) => ({ default: module.ProductCatalog }))
);
const SearchPage = lazy(() =>
  import("./views/Search").then((module) => ({ default: module.SearchPage }))
);
const ProductDetail = lazy(() =>
  import("./views/Product").then((module) => ({ default: module.ProductDetail }))
);
const CartPage = lazy(() =>
  import("./views/CartView").then((module) => ({ default: module.CartPage }))
);
const FavoritesPage = lazy(() =>
  import("./views/Favorite").then((module) => ({ default: module.FavoritesPage }))
);
const AuthPage = lazy(() =>
  import("./views/Auth").then((module) => ({ default: module.AuthPage }))
);
const ServiceFeedbackPage = lazy(() =>
  import("./views/ServiceFeedbackPage").then((module) => ({
    default: module.ServiceFeedbackPage,
  }))
);
const CheckoutPage = lazy(() =>
  import("./views/Checkout").then((module) => ({ default: module.CheckoutPage }))
);
const ProfilePage = lazy(() =>
  import("./views/account/Profile").then((module) => ({ default: module.ProfilePage }))
);
const OrdersPage = lazy(() =>
  import("./views/account/OrdersPage").then((module) => ({ default: module.OrdersPage }))
);
const AccountFavoritesPage = lazy(() =>
  import("./views/account/AccountFavorites").then((module) => ({
    default: module.AccountFavoritesPage,
  }))
);
const AddressesPage = lazy(() =>
  import("./views/account/Addresses").then((module) => ({ default: module.AddressesPage }))
);
const NotificationsPage = lazy(() =>
  import("./views/account/NotificationsPage").then((module) => ({
    default: module.NotificationsPage,
  }))
);
const UserReviewsPage = lazy(() =>
  import("./views/account/UserReviewsPage").then((module) => ({
    default: module.UserReviewsPage,
  }))
);
const MessagesPage = lazy(() =>
  import("./views/account/MessagesPage").then((module) => ({ default: module.MessagesPage }))
);
const VerificationPage = lazy(() =>
  import("./views/account/VerificationPage").then((module) => ({ default: module.VerificationPage }))
);

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-lurevia-orange" />
      <span className="sr-only">Chargement de la page</span>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppProviders>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="boutique" element={<ProductCatalog />} />
              <Route path="categories" element={<ProductCatalog />} />
              <Route path="categories/:slug" element={<ProductCatalog />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="produit/:id" element={<ProductDetail />} />
              <Route path="panier" element={<CartPage />} />
              <Route path="favoris" element={<FavoritesPage />} />
              <Route path="feedback" element={<ServiceFeedbackPage />} />
              <Route
                path="checkout"
                element={
                  <ProtectedRoute reason="Connectez-vous pour finaliser votre commande.">
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="compte"
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
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="verification" element={<VerificationPage />} />
                <Route path="avis" element={<UserReviewsPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AppProviders>
    </Router>
  );
}
