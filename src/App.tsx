import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/favoriteContexte";
import { UIProvider } from "./context/UIContext";
import { MainLayout } from "./components/layout/MainLayout";
import { Home } from "./views/Home";
import { ProductCatalog } from "./views/Shop";
import { SearchPage } from "./views/Search";
export default function App() {
  return (
    <Router>
      <UIProvider>
        <CartProvider>
          <FavoriteProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="/boutique" element={<ProductCatalog />} />
                <Route path="/categories/:slug" element={<ProductCatalog />} />
                <Route path="/search" element={< SearchPage/>} />
              </Route>
            </Routes>
          </FavoriteProvider>
        </CartProvider>
      </UIProvider>
    </Router>
  );
}