import { expect, test, type Page } from "@playwright/test";

const BASE = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

async function go(page: Page, viewport = { width: 390, height: 844 }) {
  await page.setViewportSize(viewport);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const response = await page.goto(`${BASE}/virtual-preschool`, { waitUntil: "networkidle" });
  expect(response?.ok()).toBeTruthy();
  return errors;
}

async function clickText(page: Page, name: RegExp) {
  const button = page.getByRole("button", { name }).first();
  await expect(button).toBeVisible();
  await button.click();
}

const devices = [
  { name: "iPhone portrait", vp: { width: 390, height: 844 } },
  { name: "Android portrait", vp: { width: 412, height: 915 } },
  { name: "small tablet portrait", vp: { width: 768, height: 1024 } },
  { name: "tablet landscape", vp: { width: 1180, height: 820 } },
  { name: "desktop", vp: { width: 1440, height: 900 } },
];

// 1–20: strict first-screen rendering, visual hierarchy and touch readiness.
for (const device of devices) {
  for (const check of ["brand", "hero", "ages", "worlds"] as const) {
    test(`${device.name} · first screen · ${check}`, async ({ page }) => {
      const errors = await go(page, device.vp);
      if (check === "brand") await expect(page.getByText("ΠΙΣΙΠΟΥΚ").first()).toBeVisible();
      if (check === "hero") await expect(page.getByRole("heading", { name: /Μαθαίνουμε/ })).toBeVisible();
      if (check === "ages") {
        await expect(page.getByRole("button", { name: /2–3 ετών/ })).toBeVisible();
        await expect(page.getByRole("button", { name: /4–5 ετών/ })).toBeVisible();
        await expect(page.getByRole("button", { name: /5–6 ετών/ })).toBeVisible();
      }
      if (check === "worlds") {
        await expect(page.getByRole("button", { name: /Διαδραστικά Παιχνίδια/ })).toBeVisible();
        await expect(page.getByRole("button", { name: /Κατασκευές με Πατρόν/ })).toBeVisible();
        await expect(page.getByRole("button", { name: /Ζωγραφική/ }).first()).toBeVisible();
      }
      expect(errors).toEqual([]);
    });
  }
}

// 21–36: navigation on both touch-phone and tablet/desktop surfaces.
const navPanels = [
  [/Παιχνίδια/, /Παιχνίδια/],
  [/Κατασκευές/, /Κατασκευές με Πατρόν/],
  [/Ζωγραφική/, /Ζωγραφική/],
  [/Βίντεο Ιστορίες/, /Βίντεο Ιστορίες/],
  [/Κινούμαι/, /Κινούμαι/],
  [/Σήμερα/, /αποστολή της εβδομάδας/i],
  [/Για Γονείς/, /Για Γονείς/],
  [/Αρχική/, /Μαθαίνουμε/],
] as const;
for (const vp of [{ width: 390, height: 844 }, { width: 1180, height: 820 }]) {
  for (const [button, expected] of navPanels) {
    test(`navigation ${vp.width}px · ${button}`, async ({ page }) => {
      await go(page, vp);
      if (button.source !== "Αρχική") await clickText(page, button);
      await expect(page.getByText(expected).first()).toBeVisible();
    });
  }
}

// 37–48: age-specific child choice.
for (const age of ["2–3 ετών", "4–5 ετών", "5–6 ετών"]) {
  for (const target of ["select", "games", "crafts", "stories"] as const) {
    test(`age ${age} · ${target}`, async ({ page }) => {
      await go(page);
      await clickText(page, new RegExp(age));
      if (target === "select") {
        await expect(page.getByRole("button", { name: new RegExp(age) })).toHaveClass(/on/);
      } else if (target === "games") {
        await clickText(page, /Διαδραστικά Παιχνίδια/);
        await expect(page.getByText(/Παιχνίδια/).first()).toBeVisible();
      } else if (target === "crafts") {
        await clickText(page, /Κατασκευές με Πατρόν/);
        await expect(page.locator(".v7-card").first()).toBeVisible();
      } else {
        await clickText(page, /Βίντεο Ιστορίες/);
        await expect(page.locator(".v7-card").first()).toBeVisible();
      }
    });
  }
}

// 49–60: creative studio / crafts / coloring.
for (const age of ["2–3 ετών", "4–5 ετών", "5–6 ετών"]) {
  for (const check of ["craft-list", "craft-detail", "color-palette", "color-canvas"] as const) {
    test(`creative ${age} · ${check}`, async ({ page }) => {
      await go(page, { width: 768, height: 1024 });
      await clickText(page, new RegExp(age));
      if (check.startsWith("craft")) {
        await clickText(page, /Κατασκευές με Πατρόν/);
        await expect(page.locator(".v7-card").first()).toBeVisible();
        if (check === "craft-detail") {
          await page.locator(".v7-card").first().click();
          await expect(page.locator(".v7-pattern")).toBeVisible();
          await expect(page.getByRole("button", { name: /Εκτύπ/ })).toBeVisible();
        }
      } else {
        await clickText(page, /Ζωγραφική/);
        if (check === "color-palette") await expect(page.locator(".v7-palette button").first()).toBeVisible();
        if (check === "color-canvas") {
          const swatch = page.locator(".v7-palette button").nth(1);
          await swatch.click();
          await expect(page.locator(".v7-canvas")).toBeVisible();
        }
      }
    });
  }
}

// 61–72: Greek-owned story player.
for (const age of ["2–3 ετών", "4–5 ετών", "5–6 ετών"]) {
  for (const check of ["library", "open", "controls", "greek"] as const) {
    test(`stories ${age} · ${check}`, async ({ page }) => {
      await go(page);
      await clickText(page, new RegExp(age));
      await clickText(page, /Βίντεο Ιστορίες/);
      const card = page.locator(".v7-card").first();
      await expect(card).toBeVisible();
      if (check !== "library") await card.click();
      if (check === "open") await expect(page.locator(".v7-player")).toBeVisible();
      if (check === "controls") await expect(page.locator(".v7-controls button")).toHaveCount(3);
      if (check === "greek") await expect(page.getByText(/Ελληνική αφήγηση/)).toBeVisible();
    });
  }
}

// 73–84: movement, nature and rhythm — screen-to-world behavior.
for (const age of ["2–3 ετών", "4–5 ετών", "5–6 ετών"]) {
  for (const check of ["cards", "start", "timer", "rhythm"] as const) {
    test(`move ${age} · ${check}`, async ({ page }) => {
      await go(page);
      await clickText(page, new RegExp(age));
      await clickText(page, /Κινούμαι/);
      if (check === "cards") await expect(page.locator(".v7-move-grid button").first()).toBeVisible();
      if (check === "start" || check === "timer") {
        const first = page.locator(".v7-move-grid button").first();
        await first.click();
        if (check === "timer") await expect(page.locator(".v7-timer")).toBeVisible();
      }
      if (check === "rhythm") await expect(page.getByText(/Ρυθμ/i).first()).toBeVisible();
    });
  }
}

// 85–92: installability / Android / iOS PWA foundation.
const pwaChecks = [
  "manifest-status", "manifest-name", "manifest-start-games", "manifest-shortcuts",
  "service-worker-status", "install-button", "apple-meta", "viewport-fit",
] as const;
for (const check of pwaChecks) {
  test(`PWA · ${check}`, async ({ page, request }) => {
    await go(page);
    if (check.startsWith("manifest")) {
      const res = await request.get(`${BASE}/pisipouk.webmanifest`);
      expect(res.ok()).toBeTruthy();
      const manifest = await res.json();
      if (check === "manifest-name") expect(manifest.name).toBe("Ο Κόσμος του Πισιπούκ");
      if (check === "manifest-start-games") expect(manifest.start_url).toContain("open=games");
      if (check === "manifest-shortcuts") expect(manifest.shortcuts.length).toBeGreaterThanOrEqual(3);
    }
    if (check === "service-worker-status") expect((await request.get(`${BASE}/pisipouk-sw.js`)).ok()).toBeTruthy();
    if (check === "install-button") await expect(page.getByRole("button", { name: /Εγκατάσταση|iPhone|iPad/ })).toBeVisible();
    if (check === "apple-meta") expect(await page.locator('meta[name="apple-mobile-web-app-capable"]').getAttribute("content")).toBe("yes");
    if (check === "viewport-fit") expect(await page.locator('meta[name="viewport"]').getAttribute("content")).toContain("viewport-fit=cover");
  });
}

// 93–100: strict parent/safety/privacy checks.
const parentChecks = [
  "parent-zone", "no-main-chatbot", "no-main-footer", "no-main-social", "local-progress",
  "greek-default", "english-secondary", "no-child-login",
] as const;
for (const check of parentChecks) {
  test(`strict parent · ${check}`, async ({ page }) => {
    const errors = await go(page, { width: 390, height: 844 });
    if (check === "parent-zone") {
      await clickText(page, /Για Γονείς/);
      await expect(page.getByText(/Πρόοδος|γονέ/i).first()).toBeVisible();
    }
    if (check === "no-main-chatbot") await expect(page.locator('[data-testid="chatbot"], .chatbot')).toHaveCount(0);
    if (check === "no-main-footer") await expect(page.locator("footer")).toHaveCount(0);
    if (check === "no-main-social") await expect(page.locator('[aria-label*="Facebook"], [aria-label*="Instagram"]')).toHaveCount(0);
    if (check === "local-progress") {
      const value = await page.evaluate(() => localStorage.getItem("pisipouk-v7-progress"));
      expect(value === null || value.startsWith("[")).toBeTruthy();
    }
    if (check === "greek-default") await expect(page.getByText(/ΕΛΛΗΝΙΚΟ|Μαθαίνουμε/).first()).toBeVisible();
    if (check === "english-secondary") await expect(page.getByRole("button", { name: /EL|EN/ }).first()).toBeVisible();
    if (check === "no-child-login") await expect(page.getByText(/Κωδικός πρόσβασης|Email παιδιού|Όνομα παιδιού/i)).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
