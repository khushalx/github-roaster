import Link from "next/link";

const faqs = [
  ["What is GitHub Roaster?", "GitHub Roaster is an AI roast generator for public GitHub profiles. It turns repository details, language habits, star counts, and README checks into developer jokes, with an evidence board and a comic verdict."],
  ["How do I roast my GitHub profile?", "Enter your GitHub username in Solo Roast, read the content warning, and confirm to generate your roast. You do not need to sign in to GitHub or connect an account. When the verdict arrives, you can copy the text or download a share card."],
  ["What GitHub data does it use?", "The tool fetches public profile information and up to 30 repositories sorted by most recently updated. It summarizes repository names, descriptions, primary languages, stars, and last-push dates, and checks README availability for up to 10 selected repositories. It does not access private repositories or perform a line-by-line source-code review."],
  ["Can I compare two GitHub profiles?", "Yes. Battle Mode accepts two different public GitHub usernames. It generates roasts for both profiles, compares their repository habits, and picks a winner for entertainment. You can copy the battle verdict or download a battle share card."],
  ["Does the roast score measure coding skill?", "No. Roastability and portfolio energy are comedy scores based on a limited public-data sample. They are not a code-quality audit, hiring assessment, security review, or reliable measure of a developer’s ability."],
  ["Does it need my GitHub password or private code?", "No. Only a public username is required. The app fetches public data from GitHub and sends a summary to the AI provider, Groq, to generate jokes. GitHub responses are cached temporarily to reduce repeat API calls."],
  ["Why might a roast fail or take longer?", "GitHub and the AI provider have rate limits. A missing username, a busy service, or an API timeout can prevent generation. Check that the profile is public and the username is correct, then try again later if a service is unavailable."],
];

export default function HomeContent() {
  return (
    <div className="content-sections">
      <section className="info-section" aria-labelledby="about-roaster">
        <p className="section-kicker">The evidence behind the punchlines</p>
        <h2 id="about-roaster">An AI GitHub profile roast with receipts</h2>
        <p>Your public repositories tell a story. GitHub Roaster turns that story into developer humor: the side project you last pushed to six months ago, the repository without a README, or the language that took over your portfolio. The jokes use public profile evidence rather than a generic list of programmer insults.</p>
        <div className="feature-grid">
          <article><span className="step-number">01 / Solo</span><h3>Roast your GitHub profile</h3><p>Enter one username for a personalized roast, an evidence board, a roastability score, and a final verdict. Copy the jokes or download a card to share with friends.</p><a href="#top">Try a solo roast ↑</a></article>
          <article><span className="step-number">02 / Battle</span><h3>Challenge another developer</h3><p>Put two profiles in the ring for a GitHub roast battle. Compare repository habits, hear the AI commentary, and see who survives with less roast damage.</p><Link href="/battle">Start a GitHub roast battle →</Link></article>
          <article><span className="step-number">03 / Evidence</span><h3>See what inspired the roast</h3><p>The evidence board shows the inspected repository count, primary language, stale projects, README checks, and stars. The roast is a joke; the public-data sample gives it context.</p><Link href="/how-it-works">Read how the evidence works →</Link></article>
        </div>
      </section>
      <section className="info-section faq-section" aria-labelledby="faq-heading">
        <p className="section-kicker">Before you take the stand</p>
        <h2 id="faq-heading">GitHub roast questions, answered</h2>
        <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        <p className="content-note">AI can misinterpret context. Try your own profile first, share jokes with people who welcome them, and treat every verdict as entertainment.</p>
      </section>
    </div>
  );
}
