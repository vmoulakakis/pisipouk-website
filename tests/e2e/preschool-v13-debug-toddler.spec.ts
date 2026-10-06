import { expect, test, type Page } from "@playwright/test";

const BASE_URL = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

async function openGame(page: Page) {
  await page.goto(`${BASE_URL}/virtual-preschool`, { waitUntil: "domcontentloaded" });
  await expect(page.getByText("Πρώτα η ηλικία.")).toBeVisible({ timeout: 25_000 });
  await page.getByRole("button", { name: /2 ετών/ }).first().click();
  await page.getByRole("heading", { name: "Ο κήπος που ξυπνά" }).click();
  await expect(page.locator("canvas[aria-label^='3D παιχνίδι']")).toBeVisible({ timeout: 20_000 });
  await page.waitForFunction(() => Boolean((window as any).BABYLON?.EngineStore?.LastCreatedScene?.meshes?.length > 8));
}

async function diagnoseAndClick(page: Page, meshName: string) {
  const info = await page.evaluate((meshName) => {
    const B = (window as any).BABYLON;
    const scene = B.EngineStore.LastCreatedScene;
    const engine = scene.getEngine();
    const camera = scene.activeCamera;
    const mesh = scene.meshes.find((m: any) => m.name === meshName);
    if (!mesh) throw new Error(`missing ${meshName}`);
    mesh.computeWorldMatrix(true);
    const viewport = camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
    const world = mesh.getAbsolutePosition();
    const p = B.Vector3.Project(world, B.Matrix.Identity(), scene.getTransformMatrix(), viewport);
    const pick = scene.pick(p.x, p.y);
    return {
      px: p.x,
      py: p.y,
      width: engine.getRenderWidth(),
      height: engine.getRenderHeight(),
      expected: meshName,
      picked: pick?.pickedMesh?.name || null,
      point: { x: world.x, y: world.y, z: world.z },
    };
  }, meshName);
  const box = await page.locator("canvas[aria-label^='3D παιχνίδι']").boundingBox();
  if (!box) throw new Error("canvas missing");
  const x = box.x + (info.px / info.width) * box.width;
  const y = box.y + (info.py / info.height) * box.height;
  const top = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    return el ? `${el.tagName}.${el.className || ""}` : null;
  }, { x, y });
  console.log("V13_POINTER_DIAG", JSON.stringify({ ...info, browserX: x, browserY: y, top }));
  await page.mouse.click(x, y);
  await page.waitForTimeout(160);
  console.log("V13_PROGRESS", meshName, await page.locator(".v13-guide").innerText());
}

test("diagnose toddler discovery pointer picking", async ({ page }) => {
  await openGame(page);
  for (const name of ["discover-flower-center", "discover-drum", "discover-apple", "discover-fish", "discover-turtle", "discover-bell"]) {
    await diagnoseAndClick(page, name);
  }
  await expect(page.getByRole("heading", { name: "Ωραία εξερεύνηση!" })).toBeVisible({ timeout: 3000 });
});
