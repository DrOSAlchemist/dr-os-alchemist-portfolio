import Head from "next/head";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles } from "@/lib/articles";

export default function Writing() {
  return (
    <>
      <Head>
        <title>Writing | DrOSAlchemist</title>
        <meta name="description" content="Field notes on AI infrastructure, Kubernetes, platform networking and reliable operations." />
      </Head>
      <div className="site-shell page-main">
        <div className="page-kicker">Writing / field notes from connected systems</div>
        <h1 className="page-title">Thoughts from<br />the <span className="title-highlight">operating layer.</span></h1>
        <p className="page-lede">
          Practical notes about putting models into production, shaping Kubernetes
          platforms and making infrastructure changes safer to operate.
        </p>
        <div className="writing-topics">
          <span>AI / ML systems</span><span>Kubernetes</span><span>Networking</span><span>Platform security</span>
        </div>
        <div className="page-divider" />
        <div className="article-list">
          {articles.map((article) => (
            <article className="article-row" key={article.slug}>
              <time className="article-date" dateTime={article.date}>{article.date}</time>
              <div className="article-row-copy">
                <span className="article-category">{article.category} · {article.readTime}</span>
                <h2><Link href={`/writing/${article.slug}`}>{article.title}</Link></h2>
                <p>{article.excerpt}</p>
              </div>
              <Link className="article-row-arrow" href={`/writing/${article.slug}`} aria-label={`Read ${article.title}`}>
                <ArrowUpRight aria-hidden="true" size={19} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}