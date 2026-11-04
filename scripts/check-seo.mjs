import assert from "node:assert/strict";

const base = process.argv[2] ?? "http://127.0.0.1:3100";
const canonicalOrigin = "https://githubroast.tech";
const paths = ["/", "/battle", "/how-it-works"];
const titles = new Set();
const descriptions = new Set();

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(([tag]) =>
    Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])),
  );
}

for (const path of paths) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path}: page must return 200`);
  const html = await response.text();
  const head = html.slice(0, html.indexOf("</head>"));
  const meta = tags(head, "meta");
  const links = tags(head, "link");
  const title = head.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = meta.find((tag) => tag.name === "description")?.content;
  assert.ok(title?.length > 15 && title.length < 80, `${path}: descriptive title`);
  assert.ok(description?.length > 70 && description.length <= 180, `${path}: useful description`);
  assert.ok(!titles.has(title), `${path}: unique title`);
  assert.ok(!descriptions.has(description), `${path}: unique description`);
  titles.add(title);
  descriptions.add(description);
  const canonical = new URL(path, canonicalOrigin).href;
  const canonicals = links.filter((tag) => tag.rel === "canonical");
  assert.equal(canonicals.length, 1, `${path}: exactly one canonical`);
  assert.equal(new URL(canonicals[0].href).href, canonical, `${path}: production canonical`);
  assert.ok(!meta.some((tag) => tag.name === "robots" && tag.content.includes("noindex")), `${path}: indexable`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${path}: one primary heading`);
  assert.ok(html.includes('<html lang="en"'), `${path}: document language`);
  assert.ok(links.some((tag) => tag.rel === "icon"), `${path}: favicon`);
  for (const field of ["og:title", "og:description", "og:image", "og:url"]) {
    assert.ok(meta.some((tag) => tag.property === field && tag.content), `${path}: ${field}`);
  }
  assert.equal(new URL(meta.find((tag) => tag.property === "og:url")?.content).href, canonical);
  assert.equal(meta.find((tag) => tag.name === "twitter:card")?.content, "summary_large_image");
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(([, text]) => JSON.parse(text));
  assert.ok(schemas.some((schema) => schema["@graph"]?.some((node) => node["@type"] === "WebPage" && node.url === canonical)), `${path}: valid page schema`);
  if (path !== "/") assert.ok(schemas.some((schema) => schema["@graph"]?.some((node) => node["@type"] === "BreadcrumbList")), `${path}: breadcrumbs`);
  for (const destination of paths) assert.ok(html.includes(`href="${destination}"`), `${path}: crawlable link to ${destination}`);
  console.log(`PASS ${path}: server-rendered metadata, content, links, and JSON-LD`);
}

const robots = await fetch(new URL("/robots.txt", base));
assert.equal(robots.status, 200);
const rules = await robots.text();
assert.ok(rules.includes("Allow: /"));
assert.ok(rules.includes("Disallow: /api/"));
assert.ok(rules.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
const sitemap = await fetch(new URL("/sitemap.xml", base));
assert.equal(sitemap.status, 200);
assert.match(sitemap.headers.get("content-type"), /xml/);
const xml = await sitemap.text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
assert.deepEqual(urls.sort(), paths.map((path) => new URL(path, canonicalOrigin).href).sort());

for (const [path, width, height] of [["/opengraph-image", 1200, 630], ["/icon", 48, 48], ["/apple-icon", 180, 180]]) {
  const image = await fetch(new URL(path, base));
  assert.equal(image.status, 200, `${path}: generated image works`);
  assert.equal(image.headers.get("content-type"), "image/png");
  const buffer = Buffer.from(await image.arrayBuffer());
  assert.equal(buffer.subarray(1, 4).toString(), "PNG");
  assert.equal(buffer.readUInt32BE(16), width);
  assert.equal(buffer.readUInt32BE(20), height);
}
const missing = await fetch(new URL("/this-page-must-not-exist", base));
assert.equal(missing.status, 404, "Unknown paths must return a real 404");
assert.match(await missing.text(), /name="robots" content="noindex"/);
const api = await fetch(new URL("/api/roast", base));
assert.match(api.headers.get("x-robots-tag"), /noindex/);
const tracking = await fetch(new URL("/?utm_source=seo-check", base));
const trackedCanonical = tags(await tracking.text(), "link").find((tag) => tag.rel === "canonical")?.href;
assert.equal(new URL(trackedCanonical).href, `${canonicalOrigin}/`, "Tracking URLs canonicalize to the clean homepage");
console.log("PASS crawl rules, sitemap, image dimensions, 404, API noindex, and tracking canonicals");
