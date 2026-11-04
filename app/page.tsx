import { createPageMetadata, site } from "@/lib/site";
import RoastApp from "./components/RoastApp";
import HomeContent from "./components/HomeContent";
import StructuredData from "./components/StructuredData";

export const metadata = createPageMetadata({
  title: "GitHub Roaster — AI GitHub Profile Roast & Battles",
  description: site.description,
  path: "/",
});

export default function Home() {
  return (
    <>
      <StructuredData path="/" title="GitHub Roaster" description={site.description} includeApplication />
      <RoastApp><HomeContent /></RoastApp>
    </>
  );
}
