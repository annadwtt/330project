// Runs on Vercel during the build. It writes public/config.js using the
// MAPBOX_TOKEN environment variable, so the token never has to be committed
// to GitHub.
const fs = require("fs");
const path = require("path");

const token = process.env.MAPBOX_TOKEN || "";

if (!token) {
  console.warn("WARNING: MAPBOX_TOKEN is not set. The map will not load.");
}

const out = path.join(__dirname, "public", "config.js");
fs.writeFileSync(out, `window.MAPBOX_TOKEN = ${JSON.stringify(token)};\n`);
console.log("Wrote", out);
