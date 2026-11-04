import Link from "next/link";
import { createPageMetadata } from "@/lib/site";
import RoastApp from "../components/RoastApp";
import StructuredData from "../components/StructuredData";

const title = "GitHub Roast Battle — Compare Two Profiles with AI";
const description = "Challenge a friend to an AI GitHub roast battle. Compare two public profiles, get repository-based punchlines, and download a shareable battle verdict.";
export const metadata = createPageMetadata({ title, description, path: "/battle" });

export default function BattlePage() {
  return (
    <>
      <StructuredData path="/battle" title="GitHub Roast Battle" description={description} />
      <RoastApp initialMode="battle">
        <div className="content-sections">
          <section className="info-section" aria-labelledby="battle-explained">
            <p className="section-kicker">Two profiles. One comic verdict.</p>
            <h2 id="battle-explained">How a GitHub roast battle works</h2>
            <p>Bring two different public GitHub usernames. GitHub Roaster gathers the repository evidence for each profile, then asks AI to roast both sides and compare their project habits. It is a developer comedy face-off, with a winner chosen from the supplied evidence.</p>
            <ol className="steps-list">
              <li><h3>Choose your fighters</h3><p>Enter your username and a friend’s public username. Read the content warning and confirm before starting. No GitHub login or account connection is required.</p></li>
              <li><h3>Compare the public evidence</h3><p>The app looks at up to 30 recently updated repositories per profile, primary languages, stars, stale projects, and README availability for up to 10 selected repositories. It does not access private code.</p></li>
              <li><h3>Read and share the verdict</h3><p>Each profile gets its own roast lines, score, and comic “biggest crime.” The battle adds comparisons, a winning username, and a finishing move. Copy the verdict or download the battle card.</p></li>
            </ol>
          </section>
          <section className="info-section" aria-labelledby="battle-scores">
            <h2 id="battle-scores">What does winning a roast battle mean?</h2>
            <p>The winner survived the jokes with less roast damage. Higher roast scores mean a harsher comic roast. These scores do not determine who is the better programmer: the app sees a limited public-data sample and cannot judge work in private repositories, professional experience, or code quality.</p>
            <p>AI-generated jokes and verdicts can vary between runs. If either profile cannot be found or a provider reaches its API limit, check the usernames and try again later.</p>
            <div className="content-actions"><a href="#top">Start a battle ↑</a><Link href="/">Try a solo GitHub roast</Link><Link href="/how-it-works">Understand the data and limits</Link></div>
          </section>
        </div>
      </RoastApp>
    </>
  );
}
