import Head from "next/head";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { articles, getArticle } from "@/lib/articles";

export async function getStaticPaths() {
  return {
    paths: articles.map((article) => ({ params: { slug: article.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = getArticle(params.slug);
  if (!article) return { notFound: true };
  return { props: { article } };
}

export default function ArticlePage({ article }) {
  return (
    <>
      <Head>
        <title>{article.title} | DrOSAlchemist</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:type" content="article" key="og-type" />
        <meta property="og:title" content={article.title} key="og-title" />
        <meta property="og:description" content={article.excerpt} key="og-description" />
      </Head>
      <article className="site-shell page-main article-page">
        <Link className="back-link" href="/writing"><ArrowLeft aria-hidden="true" size={15} /> All field notes</Link>
        <div className="page-kicker">{article.category}</div>
        <h1 className="page-title">{article.title}</h1>
        <p className="article-deck">{article.lead}</p>
        <div className="article-byline">
          <span>DrOSAlchemist</span>
          <time dateTime={article.date}>{article.date}</time>
          <span>{article.readTime}</span>
        </div>
        <nav className="article-toc" aria-label="In this field note">
          <h2>In this field note</h2>
          <ol>
            {article.sections.map((section, index) => (
              <li key={section.heading}><a href={`#section-${index + 1}`}>{section.heading}</a></li>
            ))}
          </ol>
          {article.references?.length > 0 && <a href="#implementation-evidence">Sources &amp; implementation evidence</a>}
        </nav>
        <div className="article-body">
          {article.sections.map((section, index) => (
            <section key={section.heading} id={`section-${index + 1}`}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && (
                <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              )}
              {section.callout && <blockquote className="article-callout">{section.callout}</blockquote>}
              {section.code && (
                <figure className="article-code">
                  <figcaption>{section.code.caption}</figcaption>
                  <pre tabIndex={0} aria-label={section.code.caption}><code>{section.code.text}</code></pre>
                </figure>
              )}
            </section>
          ))}
        </div>
        {article.references?.length > 0 && (
          <section id="implementation-evidence" className="article-references" aria-label="Sources and implementation evidence">
            <h2>Sources &amp; implementation evidence</h2>
            <ul>
              {article.references.map((reference) => (
                <li key={reference.url}>
                  <a href={reference.url} target="_blank" rel="noreferrer">
                    {reference.label} <ArrowUpRight aria-hidden="true" size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="article-endcap">
          <span className="mono-label">MORE SYSTEMS THINKING</span>
          <Link className="text-link" href="/projects">Explore the project index <ArrowUpRight aria-hidden="true" size={15} /></Link>
        </div>
      </article>
    </>
  );
}