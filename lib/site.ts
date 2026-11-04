import type { Metadata } from "next";

export const site = {
  name: "GitHub Roaster",
  url: "https://githubroast.tech",
  description:
    "Roast your GitHub profile with AI using public repos, README checks, languages, and stars. Try a solo roast or challenge a friend to a GitHub roast battle.",
};

// Vercel previews should never compete with the production domain in search.
export const isPreview = Boolean(process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production");

export function createPageMetadata({ title, description, path }: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = new URL(path, site.url).toString();
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: site.name,
      title,
      description,
      url,
      images: [{ url: `${site.url}/opengraph-image`, width: 1200, height: 630, alt: "GitHub Roaster — AI profile roasts and head-to-head roast battles" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: `${site.url}/opengraph-image`, alt: "GitHub Roaster — AI profile roasts and head-to-head roast battles" }],
    },
  };
}
