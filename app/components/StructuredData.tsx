import { site } from "@/lib/site";

export default function StructuredData({ path, title, description, includeApplication = false }: {
  path: string;
  title: string;
  description: string;
  includeApplication?: boolean;
}) {
  const url = new URL(path, site.url).toString();
  const graph: Record<string, unknown>[] = [
    { "@type": "WebSite", "@id": `${site.url}/#website`, url: `${site.url}/`, name: site.name, alternateName: "GitHub Roast", inLanguage: "en" },
    {
      "@type": "WebPage", "@id": `${url}#webpage`, url, name: title, description,
      isPartOf: { "@id": `${site.url}/#website` }, inLanguage: "en",
      ...(path !== "/" ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
      ...(includeApplication ? { mainEntity: { "@id": `${site.url}/#app` } } : {}),
    },
  ];
  if (includeApplication) {
    graph.push({
      "@type": "WebApplication", "@id": `${site.url}/#app`, name: site.name,
      url: `${site.url}/`, description: site.description,
      applicationCategory: "EntertainmentApplication", operatingSystem: "Any",
      browserRequirements: "Requires JavaScript and a modern web browser",
      featureList: ["AI GitHub profile roasts", "Public repository evidence board", "Two-profile roast battles", "Downloadable share cards"],
      // No invented reviews, ratings, prices, or search actions.
    });
  }
  if (path !== "/") {
    graph.push({
      "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
        { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/` },
        { "@type": "ListItem", position: 2, name: title, item: url },
      ],
    });
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }} />;
}
