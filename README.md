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
