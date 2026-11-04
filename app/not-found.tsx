import Link from "next/link";

export default function NotFound() {
  return <main id="main-content" className="not-found-page"><p className="section-kicker">404 / Missing evidence</p><h1>This page left no commit history.</h1><p>The page you are looking for could not be found.</p><div className="content-actions"><Link href="/">Roast a GitHub profile</Link><Link href="/battle">Start a roast battle</Link></div></main>;
}
