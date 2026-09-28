import { articles } from "@/lib/articles";
import { siteUrl } from "@/lib/site";

const staticPaths = ["/", "/about", "/projects", "/contact", "/writing"];

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function getServerSideProps({ res }) {
  const staticUrls = staticPaths.map((path) => `${siteUrl}${path}`);
  const articleUrls = articles.map((article) => ({
    url: `${siteUrl}/writing/${article.slug}`,
    lastModified: article.date,
  }));
  const entries = [
    ...staticUrls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`),
    ...articleUrls.map(({ url, lastModified }) => (
      `<url><loc>${escapeXml(url)}</loc><lastmod>${escapeXml(lastModified)}</lastmod></url>`
    )),
  ].join("");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}