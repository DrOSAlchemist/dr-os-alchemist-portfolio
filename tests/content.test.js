import assert from "node:assert/strict";
import test from "node:test";
import { articles, getArticle } from "../lib/articles.js";
import { evidenceUrl, featuredProjects, projectUrl } from "../lib/projects.js";

test("curated projects have unique identities, evidence and explicit limitations", () => {
  assert.equal(new Set(featuredProjects.map((project) => project.name)).size, featuredProjects.length);
  for (const project of featuredProjects) {
    for (const key of ["name", "title", "category", "description", "status", "evidence", "limitation", "evidencePath"]) {
      assert.equal(typeof project[key], "string", `${project.name}: missing ${key}`);
      assert.ok(project[key].trim().length > 0);
    }
    assert.ok(project.tags.length > 0);
    assert.match(projectUrl(project), /^https:\/\/github\.com\/DrOSAlchemist\/[a-z0-9-]+$/);
    assert.ok(new URL(evidenceUrl(project)).pathname.startsWith(`/DrOSAlchemist/${project.name}/`));
    if (project.noteSlug) assert.ok(getArticle(project.noteSlug), `Missing note: ${project.noteSlug}`);
  }
});

test("GPU result is scoped and consistent with the linked research record", () => {
  const project = featuredProjects.find((item) => item.name === "keda-scale-zero-gpu-inference");
  assert.match(project.evidence, /659 → 338/);
  assert.match(project.evidence, /T4 Spot.*us-east1-d.*2026-04-05/);
  assert.match(project.limitation, /measured together/);
  assert.equal(project.evidencePath, "docs/cold-start-optimization.md");
  assert.doesNotMatch(project.description, /not yet benchmarked/);
  const note = getArticle(project.noteSlug);
  assert.ok(note.references.some((reference) => reference.url === evidenceUrl(project)));
});

test("SRE evidence is explicitly offline with no live integration claim", () => {
  const project = featuredProjects.find((item) => item.name === "agentic-sre-platform");
  assert.equal(project.status, "Offline demonstrator");
  assert.match(project.evidence, /19 tests/);
  assert.match(project.limitation, /roadmap/);
  const note = getArticle(project.noteSlug);
  assert.match(note.lead, /offline/);
  assert.ok(note.references.some((reference) => reference.url.endsWith("/docs/security-model.md")));
});

test("articles have unique routable slugs and valid, named HTTPS references", () => {
  assert.equal(new Set(articles.map((article) => article.slug)).size, articles.length);
  assert.equal(getArticle("does-not-exist"), undefined);
  for (const article of articles) {
    assert.match(article.slug, /^[a-z0-9-]+$/);
    assert.match(article.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(article.sections.length > 0);
    for (const reference of article.references || []) {
      assert.ok(reference.label.trim());
      assert.equal(new URL(reference.url).protocol, "https:");
    }
  }
});
