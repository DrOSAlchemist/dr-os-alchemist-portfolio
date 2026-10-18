import assert from "node:assert/strict";
import test from "node:test";
import { getPublicRepositories, selectRepositories } from "../lib/github.js";

const repository = (name = "example", overrides = {}) => ({
  name, private: false, fork: false, archived: false,
  description: "Tested policy tooling", language: "JavaScript",
  stargazers_count: 2, forks_count: 1, topics: ["policy", "tests"],
  pushed_at: "2026-10-18T12:00:00Z", ...overrides,
});

async function load(responses, options = {}) {
  const calls = [];
  const headers = {};
  const errors = [];
  const result = await getPublicRepositories({ setHeader: (key, value) => { headers[key] = value; } }, {
    username: "DrOSAlchemist",
    logger: { error: (...args) => errors.push(args) },
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      const response = responses.shift();
      if (response instanceof Error) throw response;
      assert.ok(response, "Unexpected extra fetch");
      return response;
    },
    ...options,
  });
  return { result, calls, headers, errors };
}

const json = (value, status = 200, headers = {}) => new Response(JSON.stringify(value), { status, headers });

test("normalizes public repositories and constructs trusted GitHub URLs", async () => {
  const { result, headers, errors } = await load([json([
    repository("older", { pushed_at: null, description: null, html_url: "https://untrusted.example" }),
    repository("newer"),
    repository("private", { private: true }),
    repository("fork", { fork: true }),
    repository("archived", { archived: true }),
  ])]);
  assert.deepEqual(result.repos.map((repo) => repo.name), ["newer", "older"]);
  assert.equal(result.repos[1].url, "https://github.com/DrOSAlchemist/older");
  assert.equal(result.repos[1].description, "A public project from DrOSAlchemist.");
  assert.equal(result.unavailable, null);
  assert.match(headers["Cache-Control"], /s-maxage=3600/);
  assert.equal(errors.length, 0);
});

test("paginates using one shared deadline and deduplicates page overlaps", async () => {
  const first = Array.from({ length: 100 }, (_, i) => repository(`repo-${i}`));
  const { result, calls } = await load([json(first), json([first[0], repository("next")])]);
  assert.equal(result.repos.length, 101);
  assert.match(calls[1].url, /sort=pushed.*page=2$/);
  assert.equal(calls[0].init.signal, calls[1].init.signal);
  assert.equal(calls[0].init.headers["X-GitHub-Api-Version"], "2022-11-28");
});

test("a complete empty account remains distinct from an unavailable feed", async () => {
  const { result, headers } = await load([json([])]);
  assert.equal(result.unavailable, null);
  assert.deepEqual(result.repos, []);
  assert.match(headers["Cache-Control"], /public/);
});

test("pagination is bounded and never returns a misleading partial count", async () => {
  const full = Array.from({ length: 100 }, (_, i) => repository(`repo-${i}`));
  const { result, calls, headers, errors } = await load(Array.from({ length: 5 }, () => json(full)));
  assert.equal(calls.length, 5);
  assert.equal(result.unavailable, "pagination");
  assert.deepEqual(result.repos, []);
  assert.equal(headers["Cache-Control"], "no-store");
  assert.equal(errors.length, 1);
});

test("upstream failures on later pages discard partial data", async () => {
  const full = Array.from({ length: 100 }, (_, i) => repository(`repo-${i}`));
  const { result } = await load([json(full), json({}, 503)]);
  assert.equal(result.unavailable, "api");
  assert.deepEqual(result.repos, []);
});

test("distinguishes rate limits from other API rejections", async () => {
  for (const [status, headers, reason] of [
    [403, {}, "api"], [403, { "x-ratelimit-remaining": "0" }, "rate-limit"],
    [403, { "retry-after": "60" }, "rate-limit"], [429, {}, "rate-limit"], [404, {}, "api"],
  ]) {
    const { result, errors, headers: cache } = await load([json({}, status, headers)]);
    assert.equal(result.unavailable, reason);
    assert.equal(errors.length, 1);
    assert.equal(cache["Cache-Control"], "no-store");
  }
});

test("invalid payloads fail explicitly instead of reaching rendering", async () => {
  for (const payload of [
    {}, [null], [repository("bad/name")], [repository("bad", { stargazers_count: -1 })],
    [repository("bad", { pushed_at: "not a date" })], [repository("bad", { topics: [4] })],
    [repository("bad", { private: undefined })], [repository("bad", { language: {} })],
  ]) {
    const { result, errors } = await load([json(payload)]);
    assert.equal(result.unavailable, "data");
    assert.deepEqual(result.repos, []);
    assert.equal(errors.length, 1);
  }
  const { result } = await load([new Response("{")]);
  assert.equal(result.unavailable, "data");
});

test("rejects invalid configured owners before any network request", async () => {
  for (const username of ["bad/name", "-leading", "trailing-", "a".repeat(40)]) {
    const { result, calls } = await load([], { username });
    assert.equal(result.unavailable, "configuration");
    assert.equal(calls.length, 0);
  }
});

test("network and deadline failures log only bounded diagnostic fields", async () => {
  for (const [error, reason] of [
    [new Error("private transport detail"), "network"],
    [new DOMException("timeout", "TimeoutError"), "timeout"],
    [new DOMException("abort", "AbortError"), "timeout"],
  ]) {
    const { result, errors } = await load([error]);
    assert.equal(result.unavailable, reason);
    assert.equal(errors.length, 1);
    assert.doesNotMatch(JSON.stringify(errors), /private transport detail/);
  }
});

test("enforces the actual shared deadline instead of only classifying synthetic timeout errors", async () => {
  const keepAlive = setTimeout(() => {}, 1000);
  try {
    const { result } = await load([], {
      timeoutMs: 10,
      fetchImpl: async (_url, { signal }) => new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason), { once: true });
      }),
    });
    assert.equal(result.unavailable, "timeout");
  } finally {
    clearTimeout(keepAlive);
  }
});

test("search matches all query terms across names, descriptions and topics", () => {
  const repos = [
    { name: "alpha", description: "Infra tooling", topics: ["policy"], language: "HCL", stars: 1, pushedAt: null },
    { name: "beta", description: "Policy server", topics: ["http"], language: "JavaScript", stars: 5, pushedAt: "2026-10-18T12:00:00Z" },
  ];
  assert.deepEqual(selectRepositories(repos, { query: " POLICY   infra " }).map((repo) => repo.name), ["alpha"]);
  assert.deepEqual(selectRepositories(repos, { language: "JavaScript" }).map((repo) => repo.name), ["beta"]);
  assert.deepEqual(selectRepositories(repos, { query: "absent" }), []);
  assert.deepEqual(selectRepositories(repos, { sort: "stars" }).map((repo) => repo.name), ["beta", "alpha"]);
  assert.deepEqual(selectRepositories(repos, { sort: "name" }).map((repo) => repo.name), ["alpha", "beta"]);
  assert.equal(repos[0].name, "alpha");
});
