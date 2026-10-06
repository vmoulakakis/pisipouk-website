import { expect, test, type Page } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

const catalog = [
  { age: "2–3 ετών", title: "Το χρωματιστό λιμανάκι", kind: "collect" },
  { age: "2–3 ετών", title: "Το πικνίκ του Πισιπούκ", kind: "feed" },
  { age: "2–3 ετών", title: "Μουσικά κουδουνάκια", kind: "music" },
  { age: "2–3 ετών", title: "Κρυφτό στο νησί", kind: "treasure23" },
  { age: "4–5 ετών", title: "Ο θησαυρός του Αιγαίου", kind: "treasure45" },
  { age: "4–5 ετών", title: "Χτίζω το χωριό", kind: "build" },
  { age: "4–5 ετών", title: "Διάσωση ζώων", kind: "rescue" },
  { age: "4–5 ετών", title: "Καρναβάλι ρυθμού", kind: "music" },
  { age: "5–6 ετών", title: "Αποστολή στο λιμάνι", kind: "count" },
  { age: "5–6 ετών", title: "Ο φάρος των μοτίβων", kind: "pattern" },
  { age: "5–6 ετών", title: "Εργαστήριο της θάλασσας", kind: "science" },
  { age: "5–6 ετών", title: "Ο χάρτης του Πισιπούκ", kind: "story" },
] as const;

async function openHub(page: Page) {
  await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Το αρκουδάκι είναι ο οδηγός!")).toBeVisible({ timeout: 20_000 });
}

async function selectAge(page: Page, age: string) {
  await page.getByRole("button", { name: new RegExp(age) }).click();
}

async function openGame(page: Page, age: string, title: string) {
  await selectAge(page, age);
  await page.getByRole("heading", { name: title }).click();
  const canvas = page.locator("canvas[aria-label^='3D παιχνίδι']");
  await expect(canvas).toBeVisible({ timeout: 20_000 });
  await page.waitForFunction(() => {
    const B = (window as any).BABYLON;
    const scene = B?.EngineStore?.LastCreatedScene;
    return Boolean(scene && scene.meshes && scene.meshes.length > 8);
  }, null, { timeout: 20_000 });
}

async function exitGame(page: Page) {
  const winBack = page.getByRole("button", { name: "Επιστροφή στα παιχνίδια" });
  if (await winBack.isVisible().catch(() => false)) {
    await winBack.click();
  } else {
    await page.getByRole("button", { name: /Έξοδος/ }).click();
  }
  await expect(page.locator("canvas[aria-label^='3D παιχνίδι']")).toHaveCount(0);
}

async function trigger(page: Page, meshName: string, index = 0, times = 1) {
  await page.evaluate(({ meshName, index, times }) => {
    const B = (window as any).BABYLON;
    const scene = B?.EngineStore?.LastCreatedScene;
    if (!B || !scene) throw new Error("Babylon scene unavailable");
    const meshes = scene.meshes.filter((m: any) => m.name === meshName);
    const mesh = meshes[index];
    if (!mesh) throw new Error(`Mesh ${meshName}[${index}] missing`);
    if (!mesh.actionManager) throw new Error(`Mesh ${meshName}[${index}] has no action manager`);
    for (let i = 0; i < times; i++) {
      mesh.actionManager.processTrigger(B.ActionManager.OnPickTrigger, B.ActionEvent.CreateNew(mesh));
    }
  }, { meshName, index, times });
}

async function expectWin(page: Page) {
  await expect(page.getByRole("heading", { name: "Τα κατάφερες!" })).toBeVisible({ timeout: 8_000 });
}

async function completeKind(page: Page, kind: string) {
  if (kind === "collect") {
    await trigger(page, "color-object", 0);
    await trigger(page, "color-object", 1);
    await trigger(page, "color-object", 2);
  } else if (kind === "feed") {
    for (let i = 0; i < 4; i++) await trigger(page, "fruit", i);
  } else if (kind === "music") {
    await trigger(page, "instrument", 0, 8);
  } else if (kind === "treasure23") {
    for (let i = 0; i < 4; i++) await trigger(page, "treasure", i);
  } else if (kind === "treasure45") {
    for (let i = 0; i < 5; i++) await trigger(page, "treasure", i);
  } else if (kind === "build") {
    for (let i = 0; i < 6; i++) await trigger(page, "build-piece", i);
  } else if (kind === "rescue") {
    await trigger(page, "sea-zone"); await trigger(page, "animal", 0);
    await trigger(page, "land-zone"); await trigger(page, "animal", 1);
    await trigger(page, "sea-zone"); await trigger(page, "animal", 2);
    await trigger(page, "land-zone"); await trigger(page, "animal", 3);
  } else if (kind === "count") {
    const msg = await page.locator(".v12-guide p").textContent();
    const target = Number(msg?.match(/ακριβώς\s+(\d+)/)?.[1] || 3);
    for (let i = 0; i < target; i++) await trigger(page, "crate", i);
  } else if (kind === "pattern") {
    await trigger(page, "pattern-choice", 0);
  } else if (kind === "science") {
    for (let i = 0; i < 5; i++) await trigger(page, "science-object", i);
  } else if (kind === "story") {
    await trigger(page, "blue-path", 0);
  } else {
    throw new Error(`Unknown kind ${kind}`);
  }
  await expectWin(page);
}

test.describe.serial("Pisipouk V12 strict gameplay matrix", () => {
  test("all 12 age-specific games create coherent 3D scenes without page errors", async ({ page }) => {
    test.setTimeout(150_000);
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await openHub(page);

    for (const item of catalog) {
      await openGame(page, item.age, item.title);
      const report = await page.evaluate(() => {
        const B = (window as any).BABYLON;
        const scene = B.EngineStore.LastCreatedScene;
        const bearMeshes = scene.meshes.filter((m: any) => String(m.name).startsWith("bear-"));
        const interactive = scene.meshes.filter((m: any) => Boolean(m.actionManager));
        return { meshes: scene.meshes.length, bearMeshes: bearMeshes.length, interactive: interactive.length, disposed: scene.isDisposed };
      });
      expect(report.meshes).toBeGreaterThan(12);
      expect(report.bearMeshes).toBeGreaterThanOrEqual(8);
      expect(report.interactive).toBeGreaterThan(0);
      expect(report.disposed).toBeFalsy();
      await exitGame(page);
    }
    expect(errors).toEqual([]);
  });

  test("every unique gameplay mechanic can be completed through its actual 3D actions", async ({ page }) => {
    test.setTimeout(150_000);
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await openHub(page);

    const representatives = [
      catalog[0], catalog[1], catalog[2], catalog[3], catalog[5],
      catalog[6], catalog[8], catalog[9], catalog[10], catalog[11],
    ];

    for (const item of representatives) {
      await openGame(page, item.age, item.title);
      await completeKind(page, item.kind);
      await exitGame(page);
    }
    expect(errors).toEqual([]);
  });

  test("wrong action recovers gently and increments local parent-safe stats", async ({ page }) => {
    await openHub(page);
    await openGame(page, "5–6 ετών", "Ο φάρος των μοτίβων");
    await trigger(page, "pattern-choice", 1);
    await expect(page.locator(".v12-guide p")).toContainText("Κοίτα ξανά");
    await trigger(page, "pattern-choice", 0);
    await expectWin(page);
    await exitGame(page);

    await page.getByRole("button", { name: /Γονείς/ }).click();
    await expect(page.getByText(/Ο φάρος των μοτίβων/)).toBeVisible();
    await expect(page.getByText(/1 επαναπροσπάθειες/)).toBeVisible();
    await expect(page.getByText(/ΧΩΡΙΣ ΟΝΟΜΑ ΠΑΙΔΙΟΥ/)).toBeVisible();
  });

  test("100 child/parent sessions rotate ages and dispose 3D scenes cleanly", async ({ page }) => {
    test.setTimeout(210_000);
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await openHub(page);

    for (let i = 0; i < 100; i++) {
      const item = catalog[i % catalog.length];
      await openGame(page, item.age, item.title);
      const before = await page.evaluate(() => {
        const B = (window as any).BABYLON;
        return B.EngineStore.Instances?.length ?? 0;
      });
      expect(before).toBeGreaterThan(0);
      await exitGame(page);
      if (i % 10 === 0) {
        await page.getByRole("button", { name: /Γονείς/ }).click();
        await expect(page.getByRole("heading", { name: "Γωνιά Γονέα" })).toBeVisible();
        await page.locator(".v12-close").click();
      }
    }
    expect(errors).toEqual([]);
  });

  test("capture visual QA scenes for 2–3, 4–5 and 5–6", async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1440, height: 900 });
    await openHub(page);
    const picks = [catalog[0], catalog[4], catalog[10]];
    for (let i = 0; i < picks.length; i++) {
      const item = picks[i];
      await openGame(page, item.age, item.title);
      await page.waitForTimeout(400);
      await page.screenshot({ path: `test-results/v12-visuals/age-${i + 1}.png`, fullPage: true });
      await exitGame(page);
    }
  });
});
