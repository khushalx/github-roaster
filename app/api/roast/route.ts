import { NextResponse } from "next/server";
import {
  analyzeGitHubUser,
  GitHubAnalysisError,
  isValidGitHubUsername,
} from "@/lib/github";
import { GroqRequestError, requestGroqJson } from "@/lib/groq";
import { ROAST_VOICE } from "@/lib/roast-prompts";

export const runtime = "nodejs";

type Roast = {
  intro: string;
  lines: string[];
  savageLines: string[];
  verdict: string;
  score: number;
};

const isDevelopment = process.env.NODE_ENV === "development";

function isRoast(value: unknown): value is Roast {
  if (!value || typeof value !== "object") return false;
  const roast = value as Record<string, unknown>;
  return (
    typeof roast.intro === "string" &&
    Array.isArray(roast.lines) &&
    roast.lines.every((line) => typeof line === "string") &&
    Array.isArray(roast.savageLines) &&
    roast.savageLines.every((line) => typeof line === "string") &&
    typeof roast.verdict === "string" &&
    typeof roast.score === "number"
  );
}

function groqErrorResponse(error: unknown) {
  const groqError =
    error instanceof GroqRequestError
      ? error
      : new GroqRequestError(error instanceof Error ? error.message : String(error));
  console.error("[api/roast] Groq failure:", groqError.message);
  if (groqError.rawText) {
    console.error("[api/roast] Groq raw response text:", groqError.rawText);
  }
  return NextResponse.json(
    {
      code: "GROQ_ERROR",
      error: isDevelopment ? groqError.message : "Groq could not generate the roast",
      ...(isDevelopment && groqError.rawText
        ? { rawGroqText: groqError.rawText }
        : {}),
    },
    { status: groqError.status },
  );
}

export async function POST(request: Request) {
  console.info("[api/roast] Request started");
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.error("[api/roast] Invalid request body:", error);
    return NextResponse.json({ code: "INVALID_USERNAME" }, { status: 400 });
  }

  const username =
    typeof body === "object" && body !== null && "username" in body
      ? String(body.username).trim()
      : "";
  console.info("[api/roast] Received username:", username || "<empty>");

  if (!username || !isValidGitHubUsername(username)) {
    return NextResponse.json({ code: "INVALID_USERNAME" }, { status: 400 });
  }
  if (!process.env.GROQ_API_KEY) {
    console.error("[api/roast] Missing GROQ_API_KEY in .env.local");
    return NextResponse.json(
      { error: "Missing GROQ_API_KEY in .env.local" },
      { status: 500 },
    );
  }

  let analysis;
  try {
    analysis = await analyzeGitHubUser(username, "[api/roast]");
  } catch (error) {
    if (error instanceof GitHubAnalysisError) {
      console.error("[api/roast] GitHub analysis failed:", error.message);
      return NextResponse.json(
        {
          code: error.code,
          ...(isDevelopment ? { error: error.message } : {}),
        },
        { status: error.status },
      );
    }
    return NextResponse.json({ code: "GITHUB_ERROR" }, { status: 502 });
  }

  const summary = {
    username: analysis.username,
    bio: analysis.bio,
    public_repos: analysis.public_repos,
    account_created: analysis.account_created,
    repo_count: analysis.repo_count,
    total_stars: analysis.total_stars,
    total_forks: analysis.total_forks,
    top_languages: analysis.top_languages,
    stale_repo_count: analysis.stale_repo_count,
    stale_repo_names: analysis.stale_repo_names,
    missing_readme_count: analysis.missing_readme_count,
    missing_readme_repos: analysis.missing_readme_repos,
    empty_description_count: analysis.empty_description_count,
    weak_description_count: analysis.weak_description_count,
    weak_description_repo_names: analysis.weak_description_repo_names,
    suspicious_repo_names: analysis.suspicious_repo_names,
    most_recent_push: analysis.most_recent_push,
    portfolio_energy_score: analysis.portfolio_energy_score,
    portfolio_energy_components: analysis.portfolio_energy_components,
    top_repos: analysis.top_repos,
    analysis_note: `Repository-derived counts use the ${analysis.repo_count} most recently updated public repositories returned by GitHub.`,
    stale_threshold_days: 180,
    weak_description_threshold_characters: 24,
    portfolio_energy_note:
      "A playful completeness/activity score for roast material, not a serious skill assessment.",
  };

  const systemPrompt = `${ROAST_VOICE}

Single-profile roast:
- Use real repository names, primary-language habits, missing README files, stale projects, weak descriptions, stars, and supported bio contradictions as ammunition.
- At least four lines must cite a supplied metric, language, or repository name.
- If stale_repo_names is non-empty, name at least one stale repository. If missing_readme_repos is non-empty, name at least one repository from that list. If suspicious_repo_names is non-empty, use at least one exact name.
- intro is an immediate opening insult, not a greeting or explanation.
- Include 4-6 hard-hitting lines, then exactly 3 savageLines that escalate with fresh angles. The regular lines are not a gentle warm-up.
- verdict is one final knockout callback to the most damning supplied detail. End on the joke, with no advice or consolation.
- Give an integer roastability score from 0-100 based on the supplied material; do not give everyone the same score.
- Return raw valid JSON only, without Markdown or code fences, using exactly: {"intro":"string","lines":["string"],"savageLines":["string"],"verdict":"string","score":number}.`;

  try {
    const { data, rawText } = await requestGroqJson({
      systemPrompt,
      userPrompt: `Here is the public GitHub evidence:\n${JSON.stringify(summary)}`,
      logPrefix: "[api/roast]",
      maxCompletionTokens: 1400,
    });
    if (!isRoast(data)) {
      throw new GroqRequestError(
        "Groq JSON did not match the required roast shape",
        502,
        rawText,
      );
    }

    const roast: Roast = {
      ...data,
      lines: data.lines.slice(0, 6),
      savageLines: data.savageLines.slice(0, 3),
      score: Math.max(0, Math.min(100, Math.round(data.score))),
    };

    return NextResponse.json({
      profile: {
        username: analysis.username,
        name: analysis.name,
        bio: analysis.bio,
        avatarUrl: analysis.avatar_url,
        githubUrl: analysis.html_url,
        followers: analysis.followers,
        following: analysis.following,
        publicRepos: analysis.public_repos,
        topLanguages: analysis.top_languages.map((entry) => entry.language),
      },
      evidence: {
        publicRepos: analysis.public_repos,
        reposAnalyzed: analysis.repo_count,
        topLanguage: analysis.top_languages[0]?.language ?? "No primary language",
        languageBreakdown: analysis.top_languages,
        staleRepos: analysis.stale_repo_count,
        staleRepoNames: analysis.stale_repo_names,
        missingReadmes: analysis.missing_readme_count,
        missingReadmeRepos: analysis.missing_readme_repos,
        readmesChecked: analysis.readme_checked_count,
        totalStars: analysis.total_stars,
        portfolioEnergyScore: analysis.portfolio_energy_score,
      },
      roast,
    });
  } catch (error) {
    return groqErrorResponse(error);
  }
}
