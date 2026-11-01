
const GITHUB_USERNAME = "bhuvan-sai-krishna-reddy-maddala";

// Theme: saved choice > system preference
const root = document.documentElement;
function applyTheme(t) {
  root.setAttribute("data-theme", t);
  try { localStorage.setItem("theme", t); } catch (e) {}
}
(function () {
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  const sys = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.setAttribute("data-theme", saved || sys);
})();
function toggleTheme() {
  applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
}
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    toggleTheme();
  }
});
document.querySelectorAll(".theme").forEach((b) => b.addEventListener("click", toggleTheme));

// GitHub contribution graph (home page only)
const graph = document.getElementById("graph");
if (graph && GITHUB_USERNAME !== "your-github-username") {
  fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`)
    .then((r) => r.json())
    .then((d) => {
      const cells = graph.querySelector(".graph-cells");
      const days = d.contributions || [];
      // pad so the first column starts on Sunday
      const pad = days.length ? new Date(days[0].date).getUTCDay() : 0;
      cells.innerHTML = "";
      for (let i = 0; i < pad; i++) cells.appendChild(document.createElement("span")).className = "cell";
      days.forEach((day) => {
        const c = document.createElement("span");
        c.className = "cell";
        c.dataset.l = day.level;
        c.title = `${day.count} contributions on ${day.date}`;
        cells.appendChild(c);
      });
      const total = days.reduce((s, x) => s + x.count, 0);
      graph.querySelector(".graph-meta").textContent = `Total ${total} contributions in the last year`;
    })
    .catch(() => { graph.hidden = true; });
} else if (graph) {
  graph.querySelector(".graph-meta").textContent = "Set GITHUB_USERNAME in script.js to show your graph.";
}
