// Loaded only by the rendered-test subprocess, never by the application.
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" ? input : input.url);
  if (url.hostname !== "api.github.com") return originalFetch(input, init);
  if (process.env.PORTFOLIO_TEST_FEED === "failure") {
    return new Response("Unavailable", { status: 503 });
  }
  return Response.json([
    {
      name: "policy-demo", private: false, fork: false, archived: false,
      description: "Tested policy tooling", language: "JavaScript",
      stargazers_count: 5, forks_count: 1, topics: ["policy", "tests"],
      pushed_at: "2026-10-18T12:00:00Z",
    },
    {
      name: "infra-demo", private: false, fork: false, archived: false,
      description: "<script>not executable</script>", language: "HCL",
      stargazers_count: 0, forks_count: 0, topics: [],
      pushed_at: null,
    },
  ]);
};
