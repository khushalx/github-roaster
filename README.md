# GitHub Roaster

Generate GitHub profile roasts and head-to-head roast battles.

## Local setup

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and set `GROQ_API_KEY` to your Groq API key.
3. Run `npm run dev` and open http://localhost:3000.

## Groq configuration

Both roast endpoints default to `openai/gpt-oss-120b`, replacing the retired
`llama-3.3-70b-versatile` model. The API endpoint and `GROQ_API_KEY` are unchanged.
An existing valid Groq key can still be used.

Set the optional server-side `GROQ_MODEL` environment variable to override the
model. Choose one that supports chat completions and JSON object mode. GPT-OSS
120B and 20B use low reasoning effort, omit reasoning from responses, and receive
2,048 extra completion tokens to leave room for reasoning before the final answer.
Other models retain the requested completion budget and receive no GPT-OSS options.

For a hosted deployment, retain `GROQ_API_KEY` in your hosting environment, remove
any retired `GROQ_MODEL` override (or set it to `openai/gpt-oss-120b`), and redeploy
this code. Local `.env.local` files are not committed or deployed automatically.
Restart the development server after changing local environment variables.

Model availability: https://console.groq.com/docs/models

Deprecations: https://console.groq.com/docs/deprecations

## Checks

- `npm run lint`
- `npm run build`

## SEO and publishing

The homepage (`/`), battle tool (`/battle`), and data/method guide
(`/how-it-works`) are statically rendered with unique titles, descriptions,
production canonical URLs, social metadata, and JSON-LD. Tool functionality stays
in `app/components/RoastApp.tsx`; explanatory content stays in server components.
`lib/site.ts` owns the canonical domain and shared metadata. Update it if the
production domain ever changes.

- `/robots.txt` permits public pages, excludes `/api/`, and advertises `/sitemap.xml`.
- `/sitemap.xml` lists only real canonical pages. Add useful pages here when added
  to the site; do not add user inputs, temporary results, or invented last-modified dates.
- `/opengraph-image`, `/icon`, and `/apple-icon` generate local PNGs without
  external image or font requests. Metadata uses the production social image.
- Vercel preview/development deployments set `noindex` and disallow crawling when
  `VERCEL_ENV` is set to a value other than `production`.
- `www.githubroast.tech` permanently redirects to the apex domain when the host
  reaches this Next.js deployment. Configure both DNS/hosting domains in Vercel;
  hosting handles HTTP-to-HTTPS. Check there are no conflicting redirect rules.
- API responses carry `X-Robots-Tag: noindex, nofollow`.
- There are no fabricated reviews, ratings, or FAQ rich-result claims.

### Verify before and after deployment

1. Run `npm run lint` and `npm run build`.
2. Start the production build: `npm run start -- --hostname 127.0.0.1 --port 3100`.
3. In a second terminal, run `npm run seo:check` to verify the actual HTTP output:
   metadata, canonicals, crawlable links, JSON-LD, sitemap, robots, PNG dimensions,
   API noindex headers, clean tracking-URL canonicals, and real 404 responses.
4. Deploy and run `npm run seo:check -- https://githubroast.tech` to check the live
   deployment. A local pass alone does not update the public website.
5. Verify ownership of `githubroast.tech` in [Google Search Console](https://search.google.com/search-console).
   Use a DNS TXT record for a Domain property, or set `GOOGLE_SITE_VERIFICATION`
   to the HTML verification token for a URL-prefix property and redeploy. Do not
   put a fake token in the source.
6. Submit `https://githubroast.tech/sitemap.xml`; inspect the homepage, battle,
   and guide URLs and request indexing. Inspect social previews and use Google's
   [Rich Results Test](https://search.google.com/test/rich-results) for syntax checks.
   Basic WebSite/WebPage/WebApplication schema does not guarantee a rich result.
7. Monitor indexing, search queries, click-through rate, and field Core Web Vitals
   in Search Console. Lab Lighthouse results are diagnostic snapshots, not real
   user metrics or a promise of rankings.

The copy targets the tool's actual use cases: AI GitHub profile roasts and GitHub
roast battles. Future content should answer real developer questions with useful,
original examples. Avoid mass-generated username pages, keyword stuffing, fake
backlinks, and duplicate landing pages.
