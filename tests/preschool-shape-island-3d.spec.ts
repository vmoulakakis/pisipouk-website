import { test, expect } from "@playwright/test";
const base=process.env.PISIPOUK_PREVIEW_URL || "http://localhost:3000";

test("3D Island: WebGL engine creates a scene, guided mission, sound and free play",async({page})=>{
 const errors:string[]=[];
 page.on("pageerror",e=>errors.push(e.message));
 await page.goto(base+"/preschool/games/shape-island.html");
 await expect(page.locator("body")).toHaveAttribute("data-game-ready","true",{timeout:20000});
 await expect(page.locator("#game-canvas")).toBeVisible();
 await page.locator("#btn-start-game").click();
 await expect(page.locator("#start-splash")).toBeHidden();
 await expect(page.locator("#target-name")).not.toBeEmpty();
 await page.locator("#btn-free-play").click();
 await expect(page.locator("#target-name")).toContainText("Δοκίμασε");
 await page.locator("#btn-dance-all").click();
 await expect(page.locator("#btn-modal-continue")).toExist();
 expect(errors).toEqual([]);
});
test("V17 renders iframe for true 3D play",async({page})=>{
 await page.goto(base+"/virtual-preschool");
 await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
 const iframe=page.locator("#pisipouk-3d-shape-island");
 await expect(iframe).toBeVisible();
 const child=page.frameLocator("#pisipouk-3d-shape-island");
 await expect(child.locator("body")).toHaveAttribute("data-game-ready","true",{timeout:25000});
 await expect(child.locator("#btn-start-game")).toBeVisible();
});
