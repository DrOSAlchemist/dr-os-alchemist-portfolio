import Head from "next/head";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Not found | DrOSAlchemist</title>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <div className="site-shell not-found">
        <p className="page-kicker">404 / route not found</p>
        <h1>Lost in<br />the control plane.</h1>
        <p>This page doesn&apos;t exist, but the system is still up.</p>
        <Link className="button button-dark" href="/"><ArrowLeft aria-hidden="true" size={16} /> Back to the start</Link>
      </div>
    </>
  );
}