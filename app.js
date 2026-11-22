"use strict";
const featuredNames = ["DendriticMemorySystems", "Nexus-MCP-2.0", "Bio-CNN", "SHENZEN-I-O-Workshop-Component-Analysis-App"];
const screenshot = "https://github.com/user-attachments/assets/ea92a429-9138-4710-ad66-d56565953f59";
const status = document.getElementById("status");
const cards = document.getElementById("cards");
let repos = [];

function el(tag, text, className) {
  const item = document.createElement(tag);
  if (text !== undefined) item.textContent = text;
  if (className) item.className = className;
  return item;
}
function card(repo, featured) {
  const item = el("article", undefined, "card");
  if (featured && repo.name === "SHENZEN-I-O-Workshop-Component-Analysis-App") {
    const image = el("img");
    image.src = screenshot; image.alt = "SHENZEN I/O workshop analysis application screenshot";
    image.loading = "lazy"; item.appendChild(image);
  }
  item.appendChild(el("div", `${repo.language} · ${Explorer.topics(repo).join(" / ")}`, "meta"));
  item.appendChild(el("h3", repo.name));
  item.appendChild(el("p", repo.description || "Explore the repository for details."));
  const links = el("div", undefined, "links");
  if (repo.url) {
    const link = el("a", "Repository ↗"); link.href = repo.url; links.appendChild(link);
  }
  if (repo.homepage) {
    const link = el("a", "Project site ↗"); link.href = repo.homepage; link.rel = "noopener noreferrer"; links.appendChild(link);
  }
  item.appendChild(links);
  return item;
}
function render() {
  const shown = Explorer.filter(repos, document.getElementById("search").value,
    document.getElementById("topic").value, document.getElementById("language").value);
  document.getElementById("count").textContent = `${shown.length} of ${repos.length} public repositories`;
  cards.replaceChildren(...shown.map(repo => card(repo, false)));
  if (!shown.length) cards.appendChild(el("p", "No projects match these filters."));
}
function populate(data, message) {
  repos = data.map(Explorer.normalize).filter(repo => repo.name && repo.url)
    .sort((a, b) => a.name.localeCompare(b.name));
  const language = document.getElementById("language");
  language.replaceChildren(el("option", "All languages"));
  [...new Set(repos.map(repo => repo.language))].sort().forEach(name => language.appendChild(el("option", name)));
  const featured = document.getElementById("featuredCards");
  featured.replaceChildren(...featuredNames.map(name => repos.find(repo => repo.name === name))
    .filter(Boolean).map(repo => card(repo, true)));
  status.textContent = message;
  render();
}
async function load() {
  try {
    let url = "https://api.github.com/users/deadSwank001/repos?per_page=100&sort=full_name";
    const all = [];
    while (url) {
      const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      const page = await response.json();
      if (!Array.isArray(page)) throw new Error("Unexpected GitHub API response");
      all.push(...page);
      const next = response.headers.get("Link")?.split(",").find(part => /rel="next"/.test(part));
      const candidate = next?.match(/<([^>]+)>/)?.[1];
      url = candidate ? Explorer.safeURL(candidate, "api.github.com") : null;
      if (candidate && !url) throw new Error("Invalid pagination link");
    }
    populate(all, "Live public GitHub data.");
  } catch (error) {
    populate(window.PROJECT_SNAPSHOT, `Showing bundled snapshot: ${error.message}.`);
  }
}
["search", "topic", "language"].forEach(id => document.getElementById(id).addEventListener("input", render));
load();
