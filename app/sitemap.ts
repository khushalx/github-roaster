import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only canonical, indexable pages; no fabricated modification timestamps.
  return ["/", "/battle", "/how-it-works"].map((path) => ({
    url: new URL(path, site.url).toString(),
  }));
}
