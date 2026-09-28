import Head from "next/head";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/router";
import BrandMark from "./BrandMark";
import { siteUrl, socialImageUrl } from "@/lib/site";

const navigation = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
];

export default function SiteLayout({ children }) {
  const { pathname, asPath } = useRouter();
  const canonicalPath = (asPath.split(/[?#]/)[0] || "/").replace(/\/+$/, "") || "/";
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return (
    <>
      <Head>
        <meta name="theme-color" content="#eaf0ed" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonicalUrl} key="canonical" />
        <link rel="icon" href="/brand-mark.svg" type="image/svg+xml" />
        <meta property="og:site_name" content="DrOSAlchemist" key="og-site-name" />
        <meta property="og:type" content="website" key="og-type" />
        <meta property="og:url" content={canonicalUrl} key="og-url" />
        <meta property="og:image" content={socialImageUrl} key="og-image" />
        <meta property="og:image:alt" content="DrOSAlchemist profile image" key="og-image-alt" />
        <meta property="og:image:width" content="331" key="og-image-width" />
        <meta property="og:image:height" content="331" key="og-image-height" />
        <meta name="twitter:card" content="summary_large_image" key="twitter-card" />
        <meta name="twitter:image" content={socialImageUrl} key="twitter-image" />
        <meta name="twitter:image:alt" content="DrOSAlchemist profile image" key="twitter-image-alt" />
      </Head>
      <div className="site-shell">
        <header className="site-header">
          <Link className="brand-home" href="/" aria-label="DrOSAlchemist home">
            <BrandMark />
          </Link>
          <nav className="primary-nav" aria-label="Primary navigation">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  className={isActive ? "nav-link nav-link-active" : "nav-link"}
                  href={item.href}
                  key={item.href}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link className="header-contact" href="/contact">
            Let&apos;s connect <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
        </header>
        <main id="main-content">{children}</main>
        <footer className="site-footer">
          <div className="footer-brand">
            <BrandMark compact />
            <span className="footer-copyright">© {new Date().getFullYear()} DrOSAlchemist</span>
          </div>
          <p>Good systems make hard things feel clear.</p>
          <div className="footer-links">
            <Link href="/writing">Field notes</Link>
            <Link href="/projects">Open source</Link>
            <a href="https://github.com/DrOSAlchemist" target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight aria-hidden="true" size={13} />
            </a>
            <a href="https://www.linkedin.com/in/jsanni/" target="_blank" rel="noreferrer">
              LinkedIn <ArrowUpRight aria-hidden="true" size={13} />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}