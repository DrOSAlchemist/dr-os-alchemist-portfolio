const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const path = require("node:path");
const { test } = require("node:test");

async function withPreview(feed, check) {
  const server = spawn(process.execPath, [
    "--import", path.resolve("tests/fixtures/github-fetch.mjs"),
    path.resolve("node_modules/next/dist/bin/next"),
    "start", "--hostname", "127.0.0.1", "--port", "0",
  ], {
    env: { ...process.env, GITHUB_USERNAME: "DrOSAlchemist", PORTFOLIO_TEST_FEED: feed },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  let baseUrl;
  try {
    baseUrl = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Preview did not start: ${output}`)), 10000);
      server.on("error", (error) => { clearTimeout(timer); reject(error); });
      server.on("exit", (code) => {
        clearTimeout(timer);
        reject(new Error(`Preview exited (${code}): ${output}`));
      });
      const collect = (data) => {
        output += data.toString();
        const address = output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
        if (address && address[1] !== "0" && output.includes("Ready")) {
          clearTimeout(timer);
          resolve(address[0]);
        }
      };
      server.stdout.on("data", collect);
      server.stderr.on("data", collect);
    });
    await check(baseUrl);
  } finally {
    if (server.exitCode === null && server.signalCode === null) {
      const exited = once(server, "exit");
      server.kill("SIGTERM");
      await exited;
    }
  }
}

test("production pages retain evidence during a deterministic GitHub API failure", { timeout: 30000 }, async () => {
  await withPreview("failure", async (baseUrl) => {
    for (const route of ["/", "/projects"]) {
      const response = await fetch(`${baseUrl}${route}`);
      assert.equal(response.status, 200, route);
      assert.equal(response.headers.get("cache-control"), "no-store");
      const html = await response.text();
      assert.equal((html.match(/class="featured-project"/g) || []).length, 7);
      assert.match(html, /Unavailable/);
      assert.match(html, /659 → 338/);
      assert.match(html, /azure-devsecops-policy-pipeline/);
      assert.match(html, /Skip to content/);
      assert.match(html, /Curated/);
    }
  });
});

test("production repository controls render real counts, named metadata and escaped content", { timeout: 30000 }, async () => {
  await withPreview("success", async (baseUrl) => {
    const response = await fetch(`${baseUrl}/projects`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("cache-control"), /s-maxage=3600/);
    const html = await response.text();
    assert.equal((html.match(/class="repo-card"/g) || []).length, 2);
    for (const label of ["Search repositories", "Language", "Sort by", "Reset filters", "5 stars", "1 fork", "No push recorded"]) {
      assert.ok(html.includes(label), label);
    }
    assert.match(html, /&lt;script&gt;not executable&lt;\/script&gt;/);
    assert.doesNotMatch(html, /<script>not executable<\/script>/);
    assert.match(html, /aria-current="page"[^>]*href="\/projects"/);
  });
});

test("static case study exposes navigable sections, code and revision-backed evidence", { timeout: 30000 }, async () => {
  await withPreview("success", async (baseUrl) => {
    for (const route of ["/writing/devsecops-evidence-before-deployment", "/writing/evidence-backed-agentic-sre"]) {
      const response = await fetch(`${baseUrl}${route}`);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, /Sources &amp; implementation evidence/);
      assert.match(html, /href="#section-1"/);
      assert.match(html, /id="section-1"/);
      assert.match(html, /href="#implementation-evidence"/);
      if (route.includes("devsecops")) {
        assert.match(html, /<pre/);
        assert.match(html, /39172532890/);
        assert.match(html, /blob\/4aefdf1/);
      } else assert.match(html, /docs\/security-model\.md/);
    }
    const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
    assert.equal(sitemap.status, 200);
    assert.match(await sitemap.text(), /\/writing\/devsecops-evidence-before-deployment/);
    assert.equal((await fetch(`${baseUrl}/writing/no-such-note`)).status, 404);
  });

});

test("About lab remains navigable without a live feed and exposes every exercise contract", { timeout: 30000 }, async () => {
  await withPreview("failure", async (baseUrl) => {
    const response = await fetch(`${baseUrl}/about`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /About &amp; Engineering Lab/);
    assert.match(html, /independent systems engineer/);
    assert.match(html, /does not run code or provision resources/);
    assert.equal((html.match(/class="lab-card"/g) || []).length, 3);
    assert.equal((html.match(/<pre /g) || []).length, 3);
    for (const id of ["operator", "lab-protocol", "lab-workbench", "evidence-contract", "delivery-policy", "portfolio-failure", "gpu-cold-start"]) {
      assert.ok(html.includes(`href="#${id}"`), `Missing navigation: ${id}`);
      assert.ok(html.includes(`id="${id}"`), `Missing section: ${id}`);
    }
    for (const label of ["Prerequisites", "Execution scope", "Expected observation", "Failure check", "Next experiment", "Boundary"]) {
      assert.equal(html.split(`>${label}<`).length - 1, 3, label);
    }
    assert.match(html, /aria-current="page"[^>]*href="\/about"/);
    assert.match(html, /Research inspection/);
    assert.match(html, /not a hosted cloud sandbox/);
  });
});
