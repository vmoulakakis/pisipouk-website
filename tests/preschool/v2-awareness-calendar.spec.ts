import {test,expect} from "@playwright/test";
import {athensToday,calendarYear,orthodoxEaster,dayContext,curateGames,eventsInMonth} from "../../src/features/preschool-v2/context/awareness";
const host=(process.env.PISIPOUK_PREVIEW_URL||"http://localhost:5173").replace(/\/$/,"");
const base=host+"/pisipouk-v2-staging";
test.describe("Pisipouk contextual calendar and awareness",()=>{
 test("Easter movement is calculated correctly in Greece",()=>{
  expect(orthodoxEaster(2026)).toBe("2026-04-12");
  expect(orthodoxEaster(2027)).toBe("2027-05-02");
  const events=calendarYear(2026);
  expect(events.find(e=>e.id==="clean-monday")?.date).toBe("2026-02-23");
  expect(events.find(e=>e.id==="easter-monday")?.date).toBe("2026-04-13");
 });
 test("World Food Day, 28 October and International Education Day are sourced and dated",()=>{
  const e=calendarYear(2026);
  expect(e.find(x=>x.id==="food")?.date).toBe("2026-10-16");
  expect(e.find(x=>x.id==="oct28")?.date).toBe("2026-10-28");
  expect(e.find(x=>x.id==="education")?.date).toBe("2026-01-24");
  expect(eventsInMonth(2026,10).length).toBeGreaterThan(2);
  expect(e.every(x=>x.source.startsWith("https://"))).toBe(true);
 });
 test("same day, broad spatial category changes recommended games",()=>{
  const city=dayContext("2026-10-15","city"),island=dayContext("2026-10-15","islands");
  expect(city.featured?.id).toBe("food");
  expect(island.featured?.id).toBe("food");
  expect(city.region.name).not.toBe(island.region.name);
  expect(curateGames(city.date,"city",1)).not.toEqual(curateGames(island.date,"islands",1));
 });
 test("calendar shows selected day events and changes regional focus without geolocation",async({page})=>{
  await page.goto(base+"/adults/monthly");
  await expect(page.getByRole("heading",{name:/ημερολόγιο των ανακαλύψεων/})).toBeVisible();
  await expect(page.getByRole("button",{name:/Νησιά/})).toBeVisible();
  await page.getByRole("button",{name:/Νησιά/}).click();
  await expect(page.locator(".pwc-place-description")).toContainText("θάλασσα");
  await expect(page.getByText(/Δεν χρησιμοποιείται GPS/)).toBeVisible();
 });
 test("calendar navigates to October 2026 food day in day-grid",async({page})=>{
  await page.goto(base+"/adults/monthly");
  const target=page.locator(".pwc-cal-navigation h2");
  const now=athensToday();
  const months=(2026-Number(now.slice(0,4)))*12+(10-Number(now.slice(5,7)));
  const buttonName=months>=0?"Επόμενος μήνας":"Προηγούμενος μήνας";
  for(let i=0;i<Math.abs(months);i++)await page.getByRole("button",{name:buttonName}).click();
  await page.getByRole("gridcell",{name:/16 .*Παγκόσμια Ημέρα Διατροφής/}).click();
  await expect(page.locator(".pwc-focus h2")).toContainText("Παγκόσμια Ημέρα Διατροφής");
 });
 test("age world surfaces holiday-awareness ribbon and spatial experience",async({page})=>{
  await page.goto(base+"/ages/3-4");
  await expect(page.locator(".pwc-ribbon")).toBeVisible();
  await page.getByRole("link",{name:/Παίζω με τον χάρτη/}).click();
  await expect(page.getByRole("heading",{name:/χάρτης των ανακαλύψεων/})).toBeVisible();
  await page.getByRole("button",{name:"Δεξιά"}).click();
  await expect(page.locator(".pws-status")).toContainText(/βήμα|χάρτης|μέρος/);
 });
 test("all age-specific craft/story/pattern libraries retain full catalogs",async({page})=>{
  for(const kind of ["patterns","crafts","stories"]){
   await page.goto(base+"/ages/4-5/"+kind);
   const count=await page.locator(".pw2-pattern-gallery button").count();
   expect(count).toBe(kind==="patterns"?21:20);
   await expect(page.locator(".pwc-ribbon")).toBeVisible();
  }
 });
});
