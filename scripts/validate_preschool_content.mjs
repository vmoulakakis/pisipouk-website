import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "public", "preschool-catalog.json");
const weeklyPath = path.join(root, "public", "preschool-weekly.json");
const routePath = path.join(root, "src", "routes", "virtual-preschool-grace.tsx");

const fail = (message) => {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
};

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

for (const file of [catalogPath, weeklyPath, routePath]) {
  if (!fs.existsSync(file)) fail(`Missing required file: ${path.relative(root, file)}`);
}
if (process.exitCode) process.exit(process.exitCode);

const catalog = readJson(catalogPath);
const weekly = readJson(weeklyPath);
const allowedTypes = new Set(["game", "printable", "craft"]);

if (!Array.isArray(catalog.items) || catalog.items.length < 12) fail("Catalog must contain at least 12 vetted items.");

const ids = new Set();
for (const item of catalog.items ?? []) {
  if (!item?.id || typeof item.id !== "string") fail("Every catalog item needs a string id.");
  if (ids.has(item.id)) fail(`Duplicate catalog id: ${item.id}`);
  ids.add(item.id);
  if (!allowedTypes.has(item.type)) fail(`Invalid type for ${item.id}: ${item.type}`);
  if (!item.title || !item.skill || !item.href) fail(`Missing title/skill/href for ${item.id}`);
  if (!String(item.href).startsWith("/")) fail(`Only local hrefs are allowed: ${item.id}`);
  if (/https?:|javascript:|<script/i.test(String(item.href))) fail(`Unsafe href in ${item.id}`);
}

if (!Array.isArray(weekly.items) || weekly.items.length !== 6) fail("Weekly shelf must contain exactly 6 items.");
if (new Set(weekly.items).size !== weekly.items.length) fail("Weekly shelf contains duplicate IDs.");

const counts = { game: 0, printable: 0, craft: 0 };
for (const id of weekly.items ?? []) {
  if (!ids.has(id)) fail(`Weekly item not found in catalog: ${id}`);
  const item = catalog.items.find((candidate) => candidate.id === id);
  if (item) counts[item.type] += 1;
}

for (const [type, count] of Object.entries(counts)) {
  if (count !== 2) fail(`Weekly shelf must contain exactly 2 ${type} items; found ${count}.`);
}

const routeSource = fs.readFileSync(routePath, "utf8");
for (const eventName of [
  "preschool_grace_open",
  "preschool_activity_start",
  "preschool_print",
  "preschool_weekly_pick",
  "preschool_challenge_complete",
]) {
  if (!routeSource.includes(eventName)) fail(`Analytics event missing from Grace route: ${eventName}`);
}

if (!routeSource.includes("@page{size:A4 portrait")) fail("A4 print stylesheet is missing.");
if (!routeSource.includes("SiteLayout")) fail("Grace route must stay inside the existing SiteLayout.");

if (!process.exitCode) {
  console.log("✅ Preschool catalog/weekly shelf/Grace route validation passed.");
  console.log(`   catalog items: ${catalog.items.length}`);
  console.log(`   weekly balance: ${JSON.stringify(counts)}`);
}
