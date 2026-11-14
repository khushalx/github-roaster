# GitHub Roaster

**Your GitHub profile. On trial with AI.**

GitHub Roaster turns public repository data into developer comedy. Roast one
profile, pit two profiles against each other, or download the verdict as a share
card. No GitHub login required.

[Roast a profile](https://githubroast.tech/) ·
[Start a battle](https://githubroast.tech/battle) ·
[See how it works](https://githubroast.tech/how-it-works)

[![GitHub Roaster — solo roasts, profile battles, and shareable verdicts](https://githubroast.tech/opengraph-image)](https://githubroast.tech/)

## What you can do

| Mode | What you get |
| --- | --- |
| **Solo roast** | An opening roast, a no-mercy round, a score, and an evidence board showing the public repository signals behind the jokes. |
| **Roast battle** | Two profiles in the ring, with separate roast rounds, a side-by-side comparison, a winner, and a finishing move. |
| **Share the verdict** | Copy the roast or battle verdict as text, or download a PNG: 1200 × 675 for a solo roast, 1080 × 1350 for a battle. |

Enter one or two public usernames, then confirm the content warning to start.
Roasts can contain strong language. Scores are for comedy; they don't measure
code quality or developer skill.

## How it works

1. **Collect the evidence.** The server fetches a public profile and up to 30
   of its most recently updated repositories from GitHub. It checks for READMEs
   in up to 10 repositories selected by stars and recency.
2. **Write the roast.** The server summarizes signals such as languages, stars,
   stale projects, and missing READMEs, then sends the summary to Groq for
   generation.
3. **Deliver the verdict.** The server parses the result, and the client renders
   the roast and creates share cards on demand.

The app uses public metadata and checks README availability. It doesn't read
private repositories or review source code line by line. GitHub requests
revalidate after five minutes, so recent updates can take a little while to
appear. The [data and scoring guide](https://githubroast.tech/how-it-works) has
more detail.

## Run locally

**Prerequisites:** Node.js 20.9+ and npm. You'll need a
[Groq API key](https://console.groq.com/keys) to generate roasts.

```bash
git clone https://github.com/khushalx/github-roaster.git
cd github-roaster
npm ci
cp .env.example .env.local
```

Set `GROQ_API_KEY` in `.env.local`, then start the app:

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

| Variable | Required | Purpose |
| --- | --- | --- |
| `GROQ_API_KEY` | For generation | Authenticates server requests to Groq. |
| `GROQ_MODEL` | No | Defaults to `openai/gpt-oss-120b`. An override must support chat completions and JSON object mode. Check [Groq's model catalog](https://console.groq.com/docs/models) for availability. |
| `GITHUB_TOKEN` | No | Authenticates public GitHub API requests to help with rate limits. Add it manually to `.env.local` if needed. |
| `GOOGLE_SITE_VERIFICATION` | No | Search Console HTML tag token for verifying a hosted site. Use only the token value. |

Keep keys and tokens server-side. Don't prefix them with `NEXT_PUBLIC_` or
commit `.env.local`. Restart the dev server after editing local variables.

If a valid username hits GitHub's rate limit, wait for the limit to reset or
configure `GITHUB_TOKEN`. If generation fails, check the server log, Groq key,
and whether your Groq project can use the configured model.

## Project map

Built with **Next.js App Router**, **React**, **TypeScript**, **Tailwind CSS** and
custom CSS. **Framer Motion** handles reveals, and **html-to-image** renders the
downloadable cards in the browser.

| Path | Responsibility |
| --- | --- |
| [`app/`](app/) | Solo, battle, and guide pages, shared styles, and search metadata routes. |
| [`app/components/`](app/components/) | Forms, content warning, evidence board, battle results, and share cards. |
| [`app/api/`](app/api/) | `POST /api/roast` accepts `{ "username": "octocat" }`. `POST /api/battle` accepts `{ "usernameA": "octocat", "usernameB": "defunkt" }`. |
| [`lib/github.ts`](lib/github.ts) | GitHub requests, repository sampling, and evidence scoring. |
| [`lib/groq.ts`](lib/groq.ts) and [`lib/roast-prompts.ts`](lib/roast-prompts.ts) | Model configuration, completion parsing, and roast direction. |
| [`lib/site.ts`](lib/site.ts) and [`scripts/check-seo.mjs`](scripts/check-seo.mjs) | Canonical metadata and HTTP checks for published pages. |

## Checks and deployment

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run start -- --hostname 127.0.0.1 --port 3100
```

With the production build running, execute `npm run seo:check` in a second
terminal. It verifies metadata, canonical URLs, JSON-LD, robots and sitemap
responses, generated image dimensions, API indexing headers, and 404s. See the
[mobile audit](MOBILE_AUDIT.md) for browser coverage and device testing limits.

On Vercel, set the same server environment variables in the project's settings.
If you deploy under a different canonical domain, update
[`lib/site.ts`](lib/site.ts) and the host redirect in
[`next.config.ts`](next.config.ts). Keep the sitemap limited to real public
pages. Preview deployments restrict indexing when `VERCEL_ENV` is set and
differs from `production`.

After deployment, run `npm run seo:check -- https://githubroast.tech` against the
public site. For the canonical deployment, verify ownership in
[Google Search Console](https://search.google.com/search-console) and submit
[`sitemap.xml`](https://githubroast.tech/sitemap.xml).

---

GitHub Roaster is an independent project and is not affiliated with GitHub.
