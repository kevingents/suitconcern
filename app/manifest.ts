import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Suitconcern — B2B groothandel",
    short_name: "Suitconcern",
    description: "Premium B2B-groothandel in gala- en bedrijfskleding.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#111111",
    icons: [],
  };
}
