(function (root) {
  "use strict";
  function safeURL(value, host) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && (!host || url.hostname.toLowerCase() === host) ? url.href : null;
    } catch { return null; }
  }
  function normalize(repo) {
    return {
      name: repo.name,
      description: repo.description || "",
      url: safeURL(repo.html_url || repo.url, "github.com"),
      language: repo.language || repo.primaryLanguage?.name || "Unspecified",
      updated: repo.pushed_at || repo.pushedAt || "",
      homepage: safeURL(repo.homepage || repo.homepageUrl || ""),
      fork: Boolean(repo.fork ?? repo.isFork),
      archived: Boolean(repo.archived ?? repo.isArchived)
    };
  }
  function topics(repo) {
    const text = `${repo.name} ${repo.description}`.toLowerCase();
    const found = [];
    if (/\bai\b|llm|machine learning|neural|cnn|mcp|\brag\b|model|classification/.test(text)) found.push("AI & ML");
    if (/data|statistics|analysis|regression|clustering|visualiz|kaggle/.test(text)) found.push("Data & research");
    if (/web|site|frontend|backend|app|javascript|search engine/.test(text)) found.push("Web & apps");
    if (/solana|ethereum|crypto|trading|finance|hedge|swap|blockchain/.test(text)) found.push("Finance & blockchain");
    if (/game|blender|music|automata|\bant\b|fallout/.test(text)) found.push("Creative & games");
    return found.length ? found : ["Other"];
  }
  function filter(repos, query, topic, language) {
    const term = query.trim().toLowerCase();
    return repos.filter(repo => (!term || `${repo.name} ${repo.description} ${repo.language}`.toLowerCase().includes(term))
      && (topic === "All topics" || topics(repo).includes(topic))
      && (language === "All languages" || repo.language === language));
  }
  const api = { safeURL, normalize, topics, filter };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Explorer = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
