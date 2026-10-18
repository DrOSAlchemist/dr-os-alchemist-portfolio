import assert from "node:assert/strict";
import test from "node:test";
import { labs, labProtocol } from "../lib/labs.js";
import { featuredProjects } from "../lib/projects.js";

test("lab exercises declare reproducible inputs, observations and boundaries", () => {
  assert.equal(new Set(labs.map((lab) => lab.id)).size, labs.length);
  assert.equal(labs.length, 3);
  for (const lab of labs) {
    assert.match(lab.id, /^[a-z0-9-]+$/);
    for (const field of ["title", "mode", "projectName", "question", "prerequisites", "scope", "command", "expected", "failureCheck", "nextStep", "guideLabel", "boundary"]) {
      assert.ok(typeof lab[field] === "string" && lab[field].trim(), `${lab.id}: ${field}`);
    }
    assert.ok(lab.projectName === "dr-os-alchemist-portfolio" || featuredProjects.some((project) => project.name === lab.projectName));
    assert.match(lab.guideUrl, /^https:\/\/github\.com\/DrOSAlchemist\/[a-z0-9-]+\/blob\/(?:main|[a-f0-9]{40})\//);
    assert.match(lab.command, new RegExp(`^git clone https://github.com/DrOSAlchemist/${lab.projectName}\\.git`));
    assert.match(lab.command, new RegExp(`\\ncd ${lab.projectName}\\n`));
    assert.doesNotMatch(lab.command, /terraform apply|kubectl apply|az login|sudo |curl.+\|\s*(sh|bash)/);
  }
  assert.equal(labProtocol.length, 4);
});

test("verification exercises distinguish starters from complete upstream verification", () => {
  const delivery = labs.find((lab) => lab.id === "delivery-policy");
  assert.match(delivery.command, /checkout --detach [a-f0-9]{40}/);
  assert.match(delivery.command, /npm run check && npm test/);
  assert.match(delivery.expected, /11 passing tests/);
  assert.match(delivery.expected, /does not reproduce the full CI scan/);
  assert.match(delivery.boundary, /not the built application/);
  const portfolio = labs.find((lab) => lab.id === "portfolio-failure");
  assert.match(portfolio.command, /npm run build && npm run test:rendered/);
  assert.match(portfolio.scope, /synthetic GitHub responses/);
  assert.match(portfolio.expected, /Record the printed revision/);
});

test("GPU exercise inspects research without claiming to rerun the measurement", () => {
  const lab = labs.find((item) => item.id === "gpu-cold-start");
  assert.equal(lab.mode, "Research inspection");
  assert.match(lab.command, /git show HEAD:docs\/cold-start-optimization\.md$/);
  assert.match(lab.expected, /2026-04-05 T4 Spot.*us-east1-d/);
  assert.match(lab.boundary, /not a rerun/);
  assert.match(lab.boundary, /measured together/);
  assert.doesNotMatch(lab.command, /npm |pip |helm |kubectl |gcloud /);
});
