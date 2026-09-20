import { useContext } from "react";
import { CategoriesContext } from "../context/categoriesContextDefinition";

export const useCategories = () => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories doit être utilisé dans un CategoriesProvider");
  return ctx;
};
