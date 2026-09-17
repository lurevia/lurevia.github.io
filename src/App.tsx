import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/favoriteContexte";
import { MainLayout } from "./components/layout/MainLayout"; // Importez votre MainLayout
import { Home } from "./views/Home";

export default function App() {
  return (
    <Router>
      <CartProvider>
        <FavoriteProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </FavoriteProvider>
      </CartProvider>
    </Router>
  );
}
