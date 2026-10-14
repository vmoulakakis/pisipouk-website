import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import serverChromium from "@sparticuz/chromium";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import ts from "typescript";
import assert from "node:assert/strict";
import path from "node:path";
const base = process.env.BASE_URL || "http://127.0.0.1:5173";
const out = process.env.QA_DIR || path.resolve("test-results/preschool-world");
await fs.mkdir(out, { recursive: true });
const content = ts.transpileModule(
  await fs.readFile("src/components/preschool/world/content.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { DOMAINS, AGES } = await import(
  "data:text/javascript;base64," + Buffer.from(content).toString("base64")
);
const report = {
  base,
  started: new Date().toISOString(),
  checks: [],
  errors: [],
  screenshots: [],
  limitations: [
    "Educator review is pending.",
    "Prerecorded Greek narration is blocked by zero Creative Claw credits.",
    "Email opens an adult-confirmed draft; attachments are added by the adult.",
  ],
};
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH || (await serverChromium.executablePath()),
  args: [
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-zygote",
    "--single-process",
  ],
  headless: true,
});
const contexts = [];
let devServer;
if (!process.env.BASE_URL) {
  devServer = spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      "5173",
    ],
    { stdio: "ignore" },
  );
  for (let i = 0; i < 40; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
}
async function check(name, fn) {
  try {
    await fn();
    report.checks.push({ name, status: "PASS" });
  } catch (e) {
    report.checks.push({ name, status: "FAIL", error: String(e) });
    throw e;
  }
}
async function capture(page, name) {
  await page.screenshot({
    path: path.join(out, name + ".png"),
    fullPage: true,
  });
  report.screenshots.push(name + ".png");
}
try {
  for (const [device, width, height, touch] of [
    ["desktop", 1440, 1000, false],
    ["mobile", 390, 844, true],
  ].filter(
    (d) => !process.env.TEST_DEVICE || d[0] === process.env.TEST_DEVICE,
  )) {
    const context = await browser.newContext({
      viewport: { width, height },
      hasTouch: touch,
      isMobile: touch,
      acceptDownloads: true,
    });
    contexts.push(context);
    const page = await context.newPage();
    page.on("pageerror", (e) =>
      report.errors.push({ device, error: String(e) }),
    );
    await page.goto(base + "/virtual-preschool", { waitUntil: "networkidle" });
    await check(device + " direct React route and assets", async () => {
      assert.equal(new URL(page.url()).pathname, "/virtual-preschool");
      await page.getByRole("heading", { level: 1 }).waitFor();
      assert.equal(await page.locator("iframe").count(), 0);
      assert.equal(await page.locator('[data-testid^="domain-"]').count(), 16);
      assert.equal(
        await page
          .locator("img")
          .evaluateAll(
            (imgs) =>
              imgs.filter((i) => !i.complete || i.naturalWidth === 0).length,
          ),
        0,
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
    });
    await capture(page, device + "-village");
    await check(device + " landing accessibility", async () => {
      const a = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      assert.deepEqual(
        a.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        [],
      );
    });
    for (let age = 0; age < 4; age++) {
      await page
        .getByRole("button", { name: new RegExp("^" + AGES[age] + " ετών") })
        .click();
      for (const d of DOMAINS) {
        await page.getByTestId("domain-" + d.id).click();
        const t = d.tasks[age];
        await page
          .getByRole("heading", { name: t.title, exact: true })
          .waitFor();
        await check(
          `${device} ${AGES[age]} ${d.id}: completes, retries, exits`,
          async () => {
            const game = page.locator(".pw-game");
            if (t.mechanic === "sequence") {
              for (const value of t.sequence)
                await game
                  .getByRole("button", { name: value, exact: true })
                  .click();
            } else if (t.mechanic === "rhythm") {
              await game
                .getByRole("button", { name: "Άκουσε τη μελωδία" })
                .click();
              await game
                .getByRole("status")
                .filter({ hasText: "Τώρα η δική σου σειρά!" })
                .waitFor();
              for (const v of t.sequence)
                await game
                  .getByRole("button", { name: v, exact: true })
                  .click();
            } else if (t.mechanic === "memory") {
              const deck = t.options
                .flatMap((v, i) => [
                  { v, key: i * 2 },
                  { v, key: i * 2 + 1 },
                ])
                .sort(
                  (a, b) => ((a.key * 7 + 3) % 11) - ((b.key * 7 + 3) % 11),
                );
              for (const v of t.options) {
                for (let i = 0; i < deck.length; i++)
                  if (deck[i].v === v)
                    await game
                      .getByRole("button", {
                        name: `Κάρτα ${i + 1}`,
                        exact: true,
                      })
                      .click();
              }
            } else {
              const wrong = t.options.find((_, i) => i !== t.answer);
              if (wrong) {
                await game
                  .getByRole("button", { name: wrong, exact: true })
                  .click();
                assert.match(
                  await game.getByRole("status").innerText(),
                  /Καλή δοκιμή/,
                );
              }
              await game
                .getByRole("button", { name: t.options[t.answer], exact: true })
                .click();
            }
            assert.match(
              await game.getByRole("status").innerText(),
              /Το ανακάλυψες/,
            );
            await game
              .getByRole("button", { name: "Παίζω ξανά", exact: true })
              .click();
            assert.match(
              await game.getByRole("status").innerText(),
              /νέα προσπάθεια/,
            );
            if (device === "desktop") {
              const pending = page.waitForEvent("download");
              await page
                .getByRole("button", { name: /Φύλλο δραστηριότητας/ })
                .click();
              const download = await pending;
              const file = path.join(out, `pdf-${d.id}-${age}.pdf`);
              await download.saveAs(file);
              const bytes = await fs.readFile(file);
              assert.equal(bytes.subarray(0, 5).toString(), "%PDF-");
              assert.ok(bytes.length > 3000);
            }
            await page.getByRole("button", { name: "Πίσω στο χωριό" }).click();
          },
        );
      }
    }
    await check(
      device + " drawing pointer, undo, persistence, PNG and PDF",
      async () => {
        await page
          .getByRole("button", { name: "Ζωγραφίζω", exact: true })
          .click();
        const c = page.getByRole("application", { name: "unused" });
        const canvas = page.locator(".pw-drawing canvas");
        const blank = await canvas.evaluate((c) => c.toDataURL());
        const r = await canvas.boundingBox();
        assert.ok(r);
        if (touch) {
          await page.touchscreen.tap(r.x + r.width * 0.4, r.y + r.height * 0.4);
        } else {
          await page.mouse.move(r.x + r.width * 0.3, r.y + r.height * 0.4);
          await page.mouse.down();
          await page.mouse.move(r.x + r.width * 0.55, r.y + r.height * 0.6, {
            steps: 8,
          });
          await page.mouse.up();
        }
        const drawn = await canvas.evaluate((c) => c.toDataURL());
        assert.notEqual(blank, drawn);
        await page
          .getByRole("button", { name: "Το χωριό", exact: true })
          .click();
        await page
          .getByRole("button", { name: "Ζωγραφίζω", exact: true })
          .click();
        assert.equal(await canvas.evaluate((c) => c.toDataURL()), drawn);
        await page
          .getByRole("button", { name: "Αναίρεση", exact: true })
          .click();
        assert.equal(await canvas.evaluate((c) => c.toDataURL()), blank);
        await page.getByRole("button", { name: "Περίγραμμα φύλλου" }).click();
        const sheet = await canvas.evaluate((c) => c.toDataURL());
        assert.notEqual(blank, sheet);
        await canvas.focus();
        await page.keyboard.press("Space");
        assert.notEqual(await canvas.evaluate((c) => c.toDataURL()), sheet);
        await page.getByRole("button", { name: "Γόμα", exact: true }).click();
        assert.equal(
          await page
            .getByRole("button", { name: "Γόμα", exact: true })
            .getAttribute("aria-pressed"),
          "true",
        );
        let pending = page.waitForEvent("download");
        await page.getByRole("button", { name: "PNG", exact: true }).click();
        await (await pending).saveAs(path.join(out, device + "-drawing.png"));
        pending = page.waitForEvent("download");
        await page.getByRole("button", { name: "A4 PDF", exact: true }).click();
        await (await pending).saveAs(path.join(out, device + "-drawing.pdf"));
        await capture(page, device + "-drawing-studio");
      },
    );
    await check(device + " three stories, branches and PDF", async () => {
      await page.getByRole("button", { name: "Ιστορίες", exact: true }).click();
      const titles = [
        "Το φύλλο που ήθελε να ταξιδέψει",
        "Η βαρκούλα και το μικρό βήμα",
        "Το κουτί των ιδεών",
      ];
      for (const title of titles) {
        await page.getByRole("button", { name: title, exact: true }).click();
        for (let i = 0; i < 4; i++)
          await page
            .getByRole("button", { name: "Επόμενη σελίδα", exact: true })
            .click();
        const choices = page.locator(".pw-book .pw-answers button");
        await choices.first().click();
        assert.ok(
          (await page.locator(".pw-book>div>p").first().innerText()).length >
            40,
        );
        await choices.last().click();
      }
      const pending = page.waitForEvent("download");
      await page.getByRole("button", { name: "Η ιστορία σε A4 PDF" }).click();
      await (await pending).saveAs(path.join(out, device + "-story.pdf"));
      await capture(page, device + "-storybook");
    });
    await check(device + " seasonal lessons all 12 months", async () => {
      await page.getByRole("button", { name: "Εποχές", exact: true }).click();
      assert.equal(await page.locator(".pw-months button").count(), 12);
      for (let i = 0; i < 12; i++) {
        await page.locator(".pw-months button").nth(i).click();
        assert.equal(
          await page
            .locator(".pw-months button")
            .nth(i)
            .getAttribute("aria-pressed"),
          "true",
        );
        assert.ok(
          (await page.locator(".pw-season-card h3").innerText()).length > 5,
        );
      }
    });
    await check(device + " sorting and puzzle all age levels", async () => {
      for (let age = 0; age < 4; age++) {
        await page
          .getByRole("button", { name: "Το χωριό", exact: true })
          .click();
        await page
          .getByRole("button", { name: new RegExp("^" + AGES[age] + " ετών") })
          .click();
        await page
          .getByRole("button", { name: /Παίζω με τον Πισιπούκ/ })
          .click();
        const items = [
          ["Φύλλο", "Φυτά"],
          ["Πουλί", "Ζώα"],
          ["Λουλούδι", "Φυτά"],
          ["Ψάρι", "Ζώα"],
          ["Δέντρο", "Φυτά"],
          ["Καρότο", "Φυτά"],
          ["Μήλο", "Φυτά"],
          ["Κεράσι", "Φυτά"],
        ].slice(0, [2, 4, 6, 8][age]);
        for (const [name, kind] of items) {
          await page
            .locator(".pw-sort-items")
            .getByRole("button", { name, exact: true })
            .click();
          await page
            .locator(".pw-bins")
            .getByRole("button", { name: new RegExp("^" + kind) })
            .click();
        }
        assert.match(
          await page.locator(".pw-playground [role=status]").innerText(),
          /Τα ταξινόμησες όλα/,
        );
        await page.getByRole("button", { name: "Το παζλ του χωριού" }).click();
        const total = age < 2 ? 4 : 9;
        for (let i = 0; i < total; i++) {
          await page
            .getByRole("button", { name: `Κομμάτι ${i + 1}`, exact: true })
            .click();
          await page
            .getByRole("button", { name: `Θέση ${i + 1}`, exact: true })
            .click();
        }
        assert.match(
          await page.locator(".pw-playground [role=status]").innerText(),
          /Το χωριό είναι έτοιμο/,
        );
        await capture(page, `${device}-puzzle-age-${age}`);
      }
    });
    await check(
      device + " adult gate, search, profile isolation, sharing validation",
      async () => {
        await page.getByRole("button", { name: "Για μεγάλους" }).click();
        await page.getByLabel("Απάντηση", { exact: true }).fill("1");
        await page
          .getByRole("button", { name: "Είμαι ενήλικος · Συνέχεια" })
          .click();
        await page.getByText("Ζήτησε από έναν ενήλικο να βοηθήσει.").waitFor();
        await page.getByLabel("Απάντηση", { exact: true }).fill("12");
        await page
          .getByRole("button", { name: "Είμαι ενήλικος · Συνέχεια" })
          .click();
        await page.getByText("WORLD-2026.10.14-R1", { exact: false }).waitFor();
        await page.getByLabel("Αναζήτηση δραστηριότητας").fill("Μαθηματικά");
        assert.equal(
          await page.locator(".pw-adult-catalog article").count(),
          1,
        );
        await page.getByLabel("Τοπικό προφίλ").selectOption("Αλεπουδάκι");
        await page
          .getByText("Το ταξίδι αρχίζει με μια μικρή δοκιμή.", { exact: true })
          .waitFor();
        await page.getByLabel("Τοπικό προφίλ").selectOption("Αρκουδάκι");
        await page
          .getByRole("button", { name: "Κοινοποίησε Μαθηματικά", exact: true })
          .click();
        const send = page.getByRole("button", {
          name: "2. Άνοιγμα προσχεδίου email",
          exact: true,
        });
        assert.equal(await send.isEnabled(), false);
        await page
          .getByLabel("Email ενηλίκου", { exact: true })
          .fill("parent@example.com");
        await page
          .getByLabel("Είμαι ενήλικος και θέλω να ανοίξω αυτό το προσχέδιο.")
          .check();
        assert.equal(await send.isEnabled(), true);
        await send.click();
        await page
          .getByRole("dialog", {name:"Μοιράζομαι μια δραστηριότητα."})
          .getByRole("status")
          .filter({ hasText: "Ζητήθηκε άνοιγμα προσχεδίου" })
          .waitFor();
        await capture(page, device + "-adult-sharing");
        await page
          .getByRole("button", { name: "Κλείσιμο κοινοποίησης" })
          .click();
        const planPending = page.waitForEvent("download");
        await page
          .getByRole("button", {
            name: "Πλάνο δραστηριοτήτων & πατρόν PDF",
            exact: true,
          })
          .click();
        await (await planPending).saveAs(path.join(out, device + "-plan.pdf"));
        await page.getByLabel("Μέγεθος PDF").selectOption("A5");
        const pending = page.waitForEvent("download");
        await page
          .getByRole("button", { name: "PDF Μαθηματικά", exact: true })
          .click();
        await (await pending).saveAs(path.join(out, device + "-A5.pdf"));
        await page
          .getByRole("button", { name: "Κλείδωμα χώρου ενηλίκων" })
          .click();
        await page.reload({ waitUntil: "networkidle" });
        await page.getByRole("heading", { level: 1 }).waitFor();
        assert.equal(new URL(page.url()).pathname, "/virtual-preschool");
      },
    );
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ); /* Keep contexts alive until the browser closes: required by single-process Chromium. */
  }
  await check("No uncaught browser errors", async () =>
    assert.deepEqual(report.errors, []),
  );
} catch (e) {
  report.failure = String(e);
  console.error(e);
} finally {
  await browser.close();
  devServer?.kill();
  report.finished = new Date().toISOString();
  report.passed = report.checks.filter((c) => c.status === "PASS").length;
  report.failed = report.checks.filter((c) => c.status === "FAIL").length;
  await fs.writeFile(
    path.join(out, "acceptance.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify({
      passed: report.passed,
      failed: report.failed,
      failure: report.failure,
      out,
    }),
  );
  if (report.failure) process.exitCode = 1;
}
