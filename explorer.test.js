const test = require("node:test");
const assert = require("node:assert/strict");
const explorer = require("./explorer.js");
test("normalizes snapshot and API records", () => {
  const repo = explorer.normalize({ name: "Lab", url: "https://github.com/user/Lab", primaryLanguage: { name: "Python" }, homepageUrl: "javascript:alert(1)" });
  assert.equal(repo.language, "Python");
  assert.equal(repo.homepage, null);
  assert.equal(explorer.safeURL("https://evil.example/x", "github.com"), null);
});
test("filters by search, topic and language together", () => {
  const repos = [
    explorer.normalize({ name: "CNN", description: "machine learning", html_url: "https://github.com/user/a", language: "Python" }),
    explorer.normalize({ name: "Web", description: "website", html_url: "https://github.com/user/b", language: "JavaScript" }),
  ];
  assert.deepEqual(explorer.filter(repos, "cnn", "AI & ML", "Python").map(r => r.name), ["CNN"]);
  assert.equal(explorer.filter(repos, "cnn", "AI & ML", "JavaScript").length, 0);
});
