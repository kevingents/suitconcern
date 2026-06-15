import { loadProducts } from "@/lib/catalog";
import { FavoritesView } from "./favorites-view";

export const metadata = {
  title: "Favorieten",
};

export default async function FavorietenPage() {
  const products = await loadProducts();
  return <FavoritesView products={products} />;
}
