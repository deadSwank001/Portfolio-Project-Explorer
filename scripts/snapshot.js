"use strict";
let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => { input += chunk; });
process.stdin.on("end", () => {
  const repos = JSON.parse(input);
  process.stdout.write(`window.PROJECT_SNAPSHOT = ${JSON.stringify(repos, null, 2)};\n`);
});
