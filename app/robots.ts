import type { MetadataRoute } from "next";
import { isPreview, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPreview
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
