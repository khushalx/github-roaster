import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/" className="footer-brand">GitHub Roaster</Link>
      <div>
        <nav aria-label="Footer navigation">
          <Link href="/">AI GitHub profile roast</Link>
          <Link href="/battle">GitHub roast battle</Link>
          <Link href="/how-it-works">How it works & data use</Link>
        </nav>
        <p>Public data. AI jokes. Scores for entertainment only.</p>
      </div>
      <span>Independent project.<br />Not affiliated with GitHub.</span>
    </footer>
  );
}
