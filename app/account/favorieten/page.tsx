import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { loadProducts } from "@/lib/catalog";
import { FavoritesView } from "./favorites-view";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("account.favorieten");
  return { title: t("metaTitle") };
}

export default async function FavorietenPage() {
  const products = await loadProducts();
  return <FavoritesView products={products} />;
}
