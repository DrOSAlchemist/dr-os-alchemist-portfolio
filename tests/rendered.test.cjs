const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const path = require("node:path");
const { test } = require("node:test");

test("production pages retain evidence during a GitHub API failure", { timeout: 30000 }, async () => {
  const server = spawn(process.execPath, [
    path.resolve("node_modules/next/dist/bin/next"),
    "start", "--hostname", "127.0.0.1", "--port", "0",
  ], {
    env: { ...process.env, GITHUB_USERNAME: "portfolio-evidence-test-nonexistent-account" },
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
    const routes = ["/", "/projects", "/writing/evidence-backed-agentic-sre", "/sitemap.xml"];
    const pages = await Promise.all(routes.map(async (route) => {
      const response = await fetch(`${baseUrl}${route}`, { signal: AbortSignal.timeout(10000) });
      assert.equal(response.status, 200, route);
      return response.text();
    }));
    for (const html of pages.slice(0, 2)) {
      assert.equal((html.match(/class="featured-project"/g) || []).length, 6);
      assert.match(html, /Unavailable/);
      assert.match(html, /659 → 338/);
      assert.doesNotMatch(html, /cloud performance is not yet benchmarked/);
      assert.match(html, /https:\/\/github\.com\/DrOSAlchemist\/agentic-sre-platform/);
    }
    assert.match(pages[0], /GitHub live metadata is unavailable/);
    assert.match(pages[2], /Sources &amp; implementation evidence/);
    assert.match(pages[2], /docs\/security-model\.md/);
    assert.match(pages[3], /\/writing\/evidence-backed-agentic-sre/);
  } finally {
    if (server.exitCode === null && server.signalCode === null) {
      const exited = once(server, "exit");
      server.kill("SIGTERM");
      await exited;
    }
  }
});
