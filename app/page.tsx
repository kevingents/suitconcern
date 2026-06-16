import { Hero } from "@/components/home/hero";
import { UspBar } from "@/components/home/usp-bar";
import { CollectionsGrid } from "@/components/home/collections-grid";
import { Bestsellers } from "@/components/home/bestsellers";
import { About } from "@/components/home/about";
import { Programs } from "@/components/home/programs";
import { B2bCta } from "@/components/home/b2b-cta";
import { loadBestsellers } from "@/lib/catalog";

export default async function HomePage() {
  const bestsellers = await loadBestsellers(4);
  return (
    <>
      <Hero />
      <UspBar />
      <CollectionsGrid />
      <Bestsellers products={bestsellers} />
      <About />
      <Programs />
      <B2bCta />
    </>
  );
}
