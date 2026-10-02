import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "public", "preschool-catalog.json");
const weeklyPath = path.join(root, "public", "preschool-weekly.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const weekly = JSON.parse(fs.readFileSync(weeklyPath, "utf8"));
const byId = new Map(catalog.items.map((item) => [item.id, item]));

const now = new Date();
const isoWeek = getIsoWeek(now);
const weekLabel = `${isoWeek.year}-W${String(isoWeek.week).padStart(2, "0")}`;
const current = weekly.items.map((id) => byId.get(id)).filter(Boolean);

if (current.length !== 6) throw new Error("Weekly shelf must have 6 valid catalog items before rotation.");

const metrics = new Map(current.map((item) => [item.id, { exposure: 0, meaningful: 0 }]));
let source = "deterministic-exploration";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && serviceRole) {
  try {
    const since = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
    const url = new URL(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/pisipouk_events`);
    url.searchParams.set("select", "event_type,path,metadata,created_at");
    url.searchParams.set("created_at", `gte.${since}`);
    url.searchParams.set("limit", "10000");
    const response = await fetch(url, {
      headers: {
        apikey: serviceRole,
        Authorization: `Bearer ${serviceRole}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) throw new Error(`Supabase read failed: ${response.status}`);
    const events = await response.json();
    scoreEvents(events, current, metrics);
    source = "analytics-14d";
  } catch (error) {
    console.warn(`⚠️ Analytics read unavailable, using safe exploration rotation: ${error.message}`);
  }
} else {
  console.log("ℹ️ Supabase secrets not present; using safe deterministic exploration rotation.");
}

const nextIds = [...weekly.items];
const replacements = [];

if (source === "analytics-14d") {
  const eligible = current
    .map((item) => ({ item, ...(metrics.get(item.id) ?? { exposure: 0, meaningful: 0 }) }))
    .map((row) => ({ ...row, rate: row.exposure ? row.meaningful / row.exposure : 0 }))
    .filter((row) => row.exposure >= 5 && row.rate < 0.15)
    .sort((a, b) => a.rate - b.rate || b.exposure - a.exposure)
    .slice(0, 2);

  for (const row of eligible) {
    const replacement = chooseReplacement(row.item.type, nextIds, weekly.rotationHistory ?? [], isoWeek.week + replacements.length);
    if (replacement) {
      replaceId(nextIds, row.item.id, replacement.id);
      replacements.push({ from: row.item.id, to: replacement.id, reason: `low-engagement:${row.meaningful}/${row.exposure}` });
    }
  }
}

// If there is not enough evidence to call anything a low performer, rotate one exploration slot only.
if (replacements.length === 0) {
  const typeOrder = ["game", "printable", "craft"];
  const type = typeOrder[isoWeek.week % typeOrder.length];
  const candidates = current.filter((item) => item.type === type);
  const from = candidates[isoWeek.week % candidates.length];
  const replacement = chooseReplacement(type, nextIds, weekly.rotationHistory ?? [], isoWeek.week);
  if (from && replacement) {
    replaceId(nextIds, from.id, replacement.id);
    replacements.push({ from: from.id, to: replacement.id, reason: "exploration-slot" });
  }
}

assertBalanced(nextIds);

const historyEntry = {
  week: weekLabel,
  at: now.toISOString(),
  source,
  replacements,
};

const output = {
  version: 1,
  week: weekLabel,
  updatedAt: now.toISOString(),
  source,
  items: nextIds,
  rotationHistory: [historyEntry, ...(weekly.rotationHistory ?? [])].slice(0, 8),
};

fs.writeFileSync(weeklyPath, JSON.stringify(output, null, 2) + "\n");
console.log(`✅ Weekly Preschool refresh prepared for ${weekLabel}`);
console.log(JSON.stringify({ source, replacements, items: nextIds }, null, 2));

function scoreEvents(events, activeItems, scoreMap) {
  for (const event of events) {
    const metadata = event?.metadata && typeof event.metadata === "object" ? event.metadata : {};
    const activityId = metadata.activity_id;

    for (const item of activeItems) {
      const score = scoreMap.get(item.id);
      if (!score) continue;
      const pathMatch = item.type === "game" && pathBase(event?.path) === pathBase(item.href);
      const idMatch = activityId === item.id;

      if (event?.event_type === "preschool_weekly_pick" && idMatch) score.exposure += 1;
      if (event?.event_type === "page_view" && pathMatch) score.exposure += 1;
      if (event?.event_type === "preschool_print" && idMatch) score.meaningful += 1;
      if (pathMatch && event?.event_type && event.event_type !== "page_view") score.meaningful += 1;
    }
  }
}

function chooseReplacement(type, activeIds, history, seed) {
  const recentIds = new Set(
    history
      .slice(0, 4)
      .flatMap((entry) => (entry.replacements ?? []).flatMap((change) => [change.from, change.to])),
  );
  const pool = catalog.items.filter((item) => item.type === type && !activeIds.includes(item.id) && !recentIds.has(item.id));
  const fallbackPool = catalog.items.filter((item) => item.type === type && !activeIds.includes(item.id));
  const candidates = pool.length ? pool : fallbackPool;
  if (!candidates.length) return null;
  return candidates[Math.abs(seed) % candidates.length];
}

function replaceId(ids, from, to) {
  const index = ids.indexOf(from);
  if (index >= 0) ids[index] = to;
}

function assertBalanced(ids) {
  if (ids.length !== 6 || new Set(ids).size !== 6) throw new Error("Rotation created an invalid weekly shelf.");
  const counts = { game: 0, printable: 0, craft: 0 };
  for (const id of ids) {
    const item = byId.get(id);
    if (!item) throw new Error(`Unknown catalog ID after rotation: ${id}`);
    counts[item.type] += 1;
  }
  for (const [type, count] of Object.entries(counts)) {
    if (count !== 2) throw new Error(`Weekly shelf lost 2/2/2 balance for ${type}: ${count}`);
  }
}

function pathBase(value = "") {
  return String(value).split("?")[0].split("#")[0];
}

function getIsoWeek(date) {
  const temp = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
  return { year: temp.getUTCFullYear(), week };
}
