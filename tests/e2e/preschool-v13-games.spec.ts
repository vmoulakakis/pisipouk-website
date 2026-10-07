import { expect, test, type Page } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

const catalog = [
  ["2 ετών", "Ο κήπος που ξυπνά"],
  ["2 ετών", "Ταΐζω τον Πισιπούκ"],
  ["2 ετών", "Μουσικά ζωάκια"],
  ["2 ετών", "Πού κρύφτηκε;"],
  ["3 ετών", "Τα καλάθια των χρωμάτων"],
  ["3 ετών", "Το κολιέ του Πισιπούκ"],
  ["3 ετών", "Τι κάνει ο φίλος;"],
  ["3 ετών", "Ετοιμάζω το πικνίκ"],
  ["4 ετών", "Βάζω την ιστορία στη σειρά"],
  ["4 ετών", "Χτίζω γέφυρα για το καραβάκι"],
  ["4 ετών", "Το μαγαζάκι του Πισιπούκ"],
  ["4 ετών", "Αντέγραψε τον ρυθμό"],
  ["5–6 ετών", "Παράδοση στο λιμάνι"],
  ["5–6 ετών", "Επιπλέει ή βυθίζεται;"],
  ["5–6 ετών", "Η διαδρομή της μπίλιας"],
  ["5–6 ετών", "Η αποστολή του χαμένου χάρτη"],
] as const;

async function openHub(page: Page) {
  await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Πρώτα η ηλικία.")).toBeVisible({ timeout: 25_000 });
}

async function selectAge(page: Page, age: string) {
  await page.getByRole("button", { name: new RegExp(age.replace("–", "[–-]")) }).first().click();
}

async function openGame(page: Page, age: string, title: string) {
  await selectAge(page, age);
  await page.getByRole("heading", { name: title }).click();
  const canvas = page.locator("canvas[aria-label^='3D παιχνίδι']");
  await expect(canvas).toBeVisible({ timeout: 20_000 });
  await page.waitForFunction(() => {
    const B = (window as any).BABYLON;
    const scene = B?.EngineStore?.LastCreatedScene;
    return Boolean(scene && !scene.isDisposed && scene.meshes?.length > 8);
  }, null, { timeout: 20_000 });
}

async function closeGame(page: Page) {
  const doneButton = page.getByRole("button", { name: "Άλλο παιχνίδι" });
  if (await doneButton.isVisible().catch(() => false)) await doneButton.click();
  else await page.getByRole("button", { name: "Έξοδος από το παιχνίδι" }).click();
  await expect(page.locator("canvas[aria-label^='3D παιχνίδι']")).toHaveCount(0);
}

async function meshPoint(page: Page, meshName: string, index = 0) {
  const normalized = await page.evaluate(({ meshName, index }) => {
    const B = (window as any).BABYLON;
    const scene = B?.EngineStore?.LastCreatedScene;
    const engine = scene?.getEngine();
    const camera = scene?.activeCamera;
    const meshes = scene?.meshes?.filter((m: any) => m.name === meshName) || [];
    const mesh = meshes[index];
    if (!mesh || !engine || !camera) throw new Error(`Cannot project ${meshName}[${index}]`);
    const world = mesh.getAbsolutePosition ? mesh.getAbsolutePosition() : mesh.position;
    const viewport = camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
    const projected = B.Vector3.Project(world, B.Matrix.Identity(), scene.getTransformMatrix(), viewport);
    return { x: projected.x / engine.getRenderWidth(), y: projected.y / engine.getRenderHeight() };
  }, { meshName, index });
  const box = await page.locator("canvas[aria-label^='3D παιχνίδι']").boundingBox();
  if (!box) throw new Error("Canvas has no bounding box");
  return { x: box.x + normalized.x * box.width, y: box.y + normalized.y * box.height };
}

async function worldPoint(page: Page, x: number, y: number, z: number) {
  const normalized = await page.evaluate(({ x, y, z }) => {
    const B = (window as any).BABYLON;
    const scene = B?.EngineStore?.LastCreatedScene;
    const engine = scene?.getEngine();
    const camera = scene?.activeCamera;
    if (!scene || !engine || !camera) throw new Error("No active Babylon scene");
    const viewport = camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
    const projected = B.Vector3.Project(new B.Vector3(x, y, z), B.Matrix.Identity(), scene.getTransformMatrix(), viewport);
    return { x: projected.x / engine.getRenderWidth(), y: projected.y / engine.getRenderHeight() };
  }, { x, y, z });
  const box = await page.locator("canvas[aria-label^='3D παιχνίδι']").boundingBox();
  if (!box) throw new Error("Canvas has no bounding box");
  return { x: box.x + normalized.x * box.width, y: box.y + normalized.y * box.height };
}

async function clickMesh(page: Page, name: string, index = 0) {
  const p = await meshPoint(page, name, index);
  await page.mouse.click(p.x, p.y);
  await page.waitForTimeout(90);
}

async function dragMeshToMesh(page: Page, from: string, fromIndex: number, to: string, toIndex = 0) {
  const a = await meshPoint(page, from, fromIndex);
  const b = await meshPoint(page, to, toIndex);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(400);
}

async function dragMeshToWorld(page: Page, from: string, fromIndex: number, target: [number, number, number]) {
  const a = await meshPoint(page, from, fromIndex);
  const b = await worldPoint(page, target[0], target[1], target[2]);
  await page.mouse.move(a.x, a.y);
  await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(180);
}

async function expectDone(page: Page) {
  await expect(page.getByRole("heading", { name: "Ωραία εξερεύνηση!" })).toBeVisible({ timeout: 12_000 });
}

test.describe.serial("Pisipouk V13 games-only age-first QA", () => {
  test("catalog is strictly age-separated: 4 games for each developmental band", async ({ page }) => {
    await openHub(page);
    for (const age of ["2 ετών", "3 ετών", "4 ετών", "5–6 ετών"]) {
      await selectAge(page, age);
      await expect(page.locator(".v13-grid .v13-card")).toHaveCount(4);
    }
  });

  test("all 16 games create live Babylon scenes with Pisipouk and interaction", async ({ page }) => {
    test.setTimeout(240_000);
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await openHub(page);
    for (const [age, title] of catalog) {
      await openGame(page, age, title);
      const report = await page.evaluate(() => {
        const B = (window as any).BABYLON;
        const scene = B.EngineStore.LastCreatedScene;
        return {
          meshes: scene.meshes.length,
          bear: scene.meshes.filter((m: any) => String(m.name).startsWith("bear-")).length,
          interactive: scene.meshes.filter((m: any) => Boolean(m.actionManager) || (m.behaviors?.length || 0) > 0).length,
        };
      });
      expect(report.meshes).toBeGreaterThan(10);
      expect(report.bear).toBeGreaterThanOrEqual(8);
      expect(report.interactive).toBeGreaterThan(0);
      await closeGame(page);
    }
    expect(errors).toEqual([]);
  });

  test("2-year games use large, direct, low-failure interactions", async ({ page }) => {
    test.setTimeout(120_000);
    await openHub(page);

    await openGame(page, "2 ετών", "Ο κήπος που ξυπνά");
    for (const name of ["discover-flower-center", "discover-drum", "discover-apple", "discover-fish", "discover-turtle", "discover-bell"]) await clickMesh(page, name);
    await expectDone(page);
    await closeGame(page);

    await openGame(page, "2 ετών", "Ταΐζω τον Πισιπούκ");
    for (let i = 0; i < 4; i++) await dragMeshToMesh(page, `feed-fruit-${i}`, 0, "feed-plate");
    await expectDone(page);
    await closeGame(page);

    await openGame(page, "2 ετών", "Πού κρύφτηκε;");
    for (let i = 0; i < 3; i++) await clickMesh(page, `peek-door-${i}`);
    await expectDone(page);
  });

  test("3-year games exercise real drag/drop, fine-motor sequence and action vocabulary", async ({ page }) => {
    test.setTimeout(150_000);
    await openHub(page);

    await openGame(page, "3 ετών", "Τα καλάθια των χρωμάτων");
    await dragMeshToMesh(page, "color-object-0", 0, "color-basket-1");
    await expect(page.locator(".v13-guide p")).toContainText("ίδιο καλάθι");
    for (let i = 0; i < 6; i++) await dragMeshToMesh(page, `color-object-${i}`, 0, `color-basket-${i % 3}`);
    await expectDone(page);
    await closeGame(page);

    await openGame(page, "3 ετών", "Το κολιέ του Πισιπούκ");
    const slots: [number, number, number][] = [[-2.5,1.05,1.5],[-1.5,1.05,1.5],[-0.5,1.05,1.5],[0.5,1.05,1.5],[1.5,1.05,1.5],[2.5,1.05,1.5]];
    for (let i = 0; i < 6; i++) await dragMeshToWorld(page, `bead-${i}`, 0, slots[i]);
    await expectDone(page);
    await closeGame(page);

    await openGame(page, "3 ετών", "Τι κάνει ο φίλος;");
    for (const action of ["τρέχει", "κοιμάται", "τρώει"]) {
      await expect(page.locator(".v13-guide p")).toContainText(action);
      await clickMesh(page, `action-${action}`);
    }
    await expectDone(page);
  });

  test("4-year games require story order, construction, pretend play and memory", async ({ page }) => {
    test.setTimeout(170_000);
    await openHub(page);

    await openGame(page, "4 ετών", "Βάζω την ιστορία στη σειρά");
    for (let i = 0; i < 3; i++) await dragMeshToMesh(page, `story-token-${i}`, 0, `story-slot-${i}`);
    await expectDone(page);
    await closeGame(page);

    await openGame(page, "4 ετών", "Χτίζω γέφυρα για το καραβάκι");
    const bridgeTargets: [number, number, number][] = [[-2.25,.72,1],[-.75,.72,1],[.75,.72,1],[2.25,.72,1]];
    for (let i = 0; i < 4; i++) await dragMeshToWorld(page, `bridge-plank-${i}`, 0, bridgeTargets[i]);
    await expectDone(page);
    await closeGame(page);

    await openGame(page, "4 ετών", "Το μαγαζάκι του Πισιπούκ");
    for (const name of ["market-pear", "market-apple", "market-lemon"]) await dragMeshToMesh(page, name, 0, "market-counter");
    await expectDone(page);
    await closeGame(page);

    await openGame(page, "4 ετών", "Αντέγραψε τον ρυθμό");
    await page.waitForTimeout(2500);
    for (const i of [0,1]) await clickMesh(page, `rhythm-drum-${i}`);
    await page.waitForTimeout(3100);
    for (const i of [2,0,2]) await clickMesh(page, `rhythm-drum-${i}`);
    await page.waitForTimeout(3500);
    for (const i of [1,2,0]) await clickMesh(page, `rhythm-drum-${i}`);
    await expectDone(page);
  });

  test("5–6 games support self-correction, prediction/testing, spatial planning and branching choices", async ({ page }) => {
    test.setTimeout(170_000);
    await openHub(page);

    await openGame(page, "5–6 ετών", "Παράδοση στο λιμάνι");
    const text = await page.locator(".v13-guide p").textContent();
    const target = Number(text?.match(/ακριβώς\s+(\d+)/)?.[1] || 4);
    for (let i = 0; i < target; i++) await clickMesh(page, `count-crate-${i}`);
    await clickMesh(page, "count-send");
    await expectDone(page);
    await closeGame(page);

    await openGame(page, "5–6 ετών", "Επιπλέει ή βυθίζεται;");
    for (let i = 0; i < 4; i++) {
      await clickMesh(page, i % 2 ? "predict-sink" : "predict-float");
      await page.waitForTimeout(1200);
    }
    await expectDone(page);
    await closeGame(page);

    await openGame(page, "5–6 ετών", "Η διαδρομή της μπίλιας");
    const rampTargets: [number, number, number][] = [[-1.9,1.05,.5],[0,1.05,.5],[1.9,1.05,.5]];
    for (let i = 0; i < 3; i++) await dragMeshToWorld(page, `marble-ramp-${i}`, 0, rampTargets[i]);
    await clickMesh(page, "marble-launch");
    await expectDone(page);
    await closeGame(page);

    await openGame(page, "5–6 ετών", "Η αποστολή του χαμένου χάρτη");
    await clickMesh(page, "quest-left");
    await clickMesh(page, "quest-right");
    await clickMesh(page, "quest-left");
    await expectDone(page);
  });

  test("100 open/close sessions dispose scenes instead of accumulating active canvases", async ({ page }) => {
    test.setTimeout(600_000);
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    await openHub(page);
    for (let i = 0; i < 100; i++) {
      const [age, title] = catalog[i % catalog.length];
      await openGame(page, age, title);
      await closeGame(page);
      await expect(page.locator("canvas[aria-label^='3D παιχνίδι']")).toHaveCount(0);
    }
    expect(errors).toEqual([]);
  });

  test("mobile game controls remain touch reachable", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openHub(page);
    await openGame(page, "2 ετών", "Μουσικά ζωάκια");
    const exit = page.getByRole("button", { name: "Έξοδος από το παιχνίδι" });
    const box = await exit.boundingBox();
    expect(box?.height || 0).toBeGreaterThanOrEqual(44);
    await expect(page.locator(".v13-guide")).toBeVisible();
  });
});
