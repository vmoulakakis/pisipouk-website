import { test, expect } from "@playwright/test";

const BASE = process.env.PRESCHOOL_BASE_URL || "http://127.0.0.1:4173";

test.describe("Pisipouk Wonder — isolated virtual preschool redesign", () => {
  test("age selection changes game and printable availability", async ({ page }) => {
    const errors:string[]=[];
    page.on("pageerror",e=>errors.push(e.message));
    await page.goto(BASE+"/virtual-preschool");
    await expect(page.getByRole("heading",{name:/μαγική ανακάλυψη/i})).toBeVisible();
    await page.getByRole("button",{name:/2–3 ετών/}).click();
    await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
    await expect(page.getByRole("button",{name:/Το ουράνιο τόξο/})).toBeVisible();
    await expect(page.getByRole("button",{name:/Ο κήπος με τα μήλα/})).toHaveCount(0);
    await page.getByRole("button",{name:/5–6 ετών/}).click();
    await expect(page.getByRole("button",{name:/Ο κήπος με τα μήλα/})).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("plays the color activity with gentle feedback and restart", async ({ page }) => {
    await page.goto(BASE+"/virtual-preschool");
    await page.getByRole("button",{name:/Παιχνίδια/}).first().click();
    await page.getByRole("button",{name:/Το ουράνιο τόξο/}).click();
    await expect(page.getByText("Βρες το κόκκινο!")).toBeVisible();
    await page.getByRole("button",{name:"μπλε"}).click();
    await expect(page.getByText(/δοκιμάσουμε ξανά/i)).toBeVisible();
    await page.getByRole("button",{name:"κόκκινο"}).click();
    await expect(page.getByText("Βρες το μπλε!")).toBeVisible();
    await page.getByRole("button",{name:/Από την αρχή/}).click();
    await expect(page.getByText("Βρες το κόκκινο!")).toBeVisible();
  });

  test("opens craft steps with a real A4 outline", async ({ page }) => {
    await page.goto(BASE+"/virtual-preschool");
    await page.getByRole("button",{name:/Κατασκευές/}).first().click();
    await page.getByRole("button",{name:/Το λουλούδι της φιλίας/}).click();
    await expect(page.getByText("ΒΗΜΑ 1 ΑΠΟ 4")).toBeVisible();
    await expect(page.getByRole("img",{name:/Ασπρόμαυρο πατρόν Α4/})).toBeVisible();
    await expect(page.getByRole("button",{name:/Πατρόν SVG Α4/})).toBeVisible();
    await page.getByRole("button",{name:/Επόμενο βήμα/}).click();
    await expect(page.getByText("ΒΗΜΑ 2 ΑΠΟ 4")).toBeVisible();
  });

  test("preserves legacy sixteen-domain world and other routes", async ({ page }) => {
    await page.goto(BASE+"/virtual-preschool");
    await page.getByRole("button",{name:/16 κόσμοι/}).first().click();
    await expect(page.getByRole("button",{name:/Πίσω στη νέα αρχική/})).toBeVisible();
    await page.getByRole("button",{name:/Πίσω στη νέα αρχική/}).click();
    await expect(page.getByRole("heading",{name:/μαγική ανακάλυψη/i})).toBeVisible();
    for(const path of ["/","/virtual-preschool-grace","/learning-games"]){
      const response=await page.goto(BASE+path);
      expect(response?.ok()).toBeTruthy();
    }
  });

  test("renders at mobile width without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({width:390,height:844});
    await page.goto(BASE+"/virtual-preschool");
    await expect(page.getByRole("heading",{name:/μαγική ανακάλυψη/i})).toBeVisible();
    const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:window.innerWidth}));
    expect(width.scroll).toBeLessThanOrEqual(width.view+1);
  });
});


test.describe("Full educational regression before production", () => {
  test("all six games can be finished and restarted", async ({ page }) => {
    await page.goto(BASE+"/virtual-preschool");
    await page.getByRole("button",{name:/5–6 ετών/}).click();
    await page.getByRole("button",{name:"Παιχνίδια"}).click();
    const gamePaths=[
      {name:"Το ουράνιο τόξο",choices:["κόκκινο","μπλε","κίτρινο"]},
      {name:"Σχήματα στη φωλιά",choices:["κύκλος","τετράγωνο","τρίγωνο"]},
      {name:"Το μονοπάτι των μοτίβων",choices:["🔴","⭐","🔴"]},
      {name:"Ο κήπος με τα μήλα",choices:["5","6","7"]},
      {name:"Πώς νιώθει ο φίλος μου;",choices:["χαρά","λύπη","έκπληξη"]}
    ];
    for(const g of gamePaths){
      await page.getByRole("button",{name:new RegExp(g.name)}).click();
      for(const answer of g.choices){
        await page.getByRole("button",{name:g.name==="Πώς νιώθει ο φίλος μου;"?new RegExp(answer+"$"):answer,exact:g.name!=="Πώς νιώθει ο φίλος μου;"}).click();
      }
      await expect(page.getByRole("heading",{name:/Τα κατάφερες/})).toBeVisible();
      await page.getByRole("button",{name:/Παίζω ξανά/}).click();
      await expect(page.getByRole("heading",{name:/Τα κατάφερες/})).toHaveCount(0);
      await page.getByRole("button",{name:/Όλα τα παιχνίδια/}).click();
    }
    await page.getByRole("button",{name:/Μεγαλώνω τον Σπορούλη/}).click();
    for(const answer of ["Βάζω τον σπόρο","Ποτίζω λίγο","Βρίσκω το φως","Παρατηρώ το βλαστάρι"]){
      await page.getByRole("button",{name:new RegExp(answer)}).click();
    }
    await expect(page.getByRole("heading",{name:/Τα κατάφερες/})).toBeVisible();
  });

  test("all five crafts offer real downloadable SVG and four distinct steps", async ({page})=>{
    await page.goto(BASE+"/virtual-preschool");
    await page.getByRole("button",{name:/5–6 ετών/}).click();
    await page.getByRole("button",{name:"Κατασκευές"}).click();
    const crafts=["Το λουλούδι της φιλίας","Η πεταλούδα των χρωμάτων","Η μάσκα του Πισιπούκ","Το δέντρο των εποχών","Ο Σπορούλης μεγαλώνει"];
    for(const title of crafts){
      await page.getByRole("button",{name:new RegExp(title)}).click();
      await expect(page.getByRole("img",{name:new RegExp("Ασπρόμαυρο πατρόν Α4: "+title)})).toBeVisible();
      const downloading=page.waitForEvent("download");
      await page.getByRole("button",{name:/Πατρόν SVG Α4/}).click();
      const file=await downloading;
      expect(file.suggestedFilename()).toMatch(/^pisipouk-patron-.*-A4\.svg$/);
      for(let i=2;i<=4;i++){
        await page.getByRole("button",{name:/Επόμενο βήμα/}).click();
        await expect(page.getByText("ΒΗΜΑ "+i+" ΑΠΟ 4")).toBeVisible();
      }
      await page.getByRole("button",{name:/Το έφτιαξα/}).click();
      await expect(page.getByText(/Μπράβο για την προσπάθεια/)).toBeVisible();
      await page.getByRole("button",{name:/Όλες οι κατασκευές/}).click();
    }
  });

  test("draws, edits, downloads PNG, and exports an A4 PDF", async ({page})=>{
    await page.goto(BASE+"/virtual-preschool");
    await page.getByRole("button",{name:"Ζωγραφική"}).click();
    const canvas=page.getByRole("canvas",{name:"Καμβάς ζωγραφικής"});
    await expect(page.locator("canvas[aria-label='Καμβάς ζωγραφικής']")).toBeVisible();
    await page.locator("canvas[aria-label='Καμβάς ζωγραφικής']").focus();
    await page.keyboard.press("Space");
    await expect(page.getByText("Προστέθηκε μια πινελιά.")).toBeVisible();
    await page.getByRole("button",{name:"Περίγραμμα λουλουδιού"}).click();
    await expect(page.getByText(/Το περίγραμμα είναι έτοιμο/)).toBeVisible();
    const pngPromise=page.waitForEvent("download");
    await page.getByRole("button",{name:"PNG",exact:true}).click();
    expect((await pngPromise).suggestedFilename()).toBe("pisipouk-zografia.png");
    const pdfPromise=page.waitForEvent("download",{timeout:25000});
    await page.getByRole("button",{name:"A4 PDF"}).click();
    expect((await pdfPromise).suggestedFilename()).toBe("pisipouk-zografia-A4.pdf");
    void canvas;
  });

  test("story page turning, ending selection and Greek story PDF work", async ({page})=>{
    await page.goto(BASE+"/virtual-preschool");
    await page.getByRole("button",{name:"Ιστορίες"}).click();
    await expect(page.getByText("ΣΕΛΙΔΑ 1 / 5")).toBeVisible();
    for(let i=2;i<=5;i++){
      await page.getByRole("button",{name:"Επόμενη σελίδα"}).click();
      await expect(page.getByText("ΣΕΛΙΔΑ "+i+" / 5")).toBeVisible();
    }
    await page.getByRole("button",{name:"Στον κήπο"}).click();
    await expect(page.getByText(/Στον κήπο βρήκε παρέα/)).toBeVisible();
    const pdfPromise=page.waitForEvent("download",{timeout:25000});
    await page.getByRole("button",{name:/Η ιστορία σε A4 PDF/}).click();
    expect((await pdfPromise).suggestedFilename()).toBe("pisipouk-istoria-A4.pdf");
  });

  test("adult information dialog opens and closes without changing child view", async ({page})=>{
    await page.goto(BASE+"/virtual-preschool");
    await page.getByRole("button",{name:/Για μεγάλους/}).click();
    const dlg=page.getByRole("dialog",{name:/Εμπειρίες με νόημα/});
    await expect(dlg).toBeVisible();
    await page.getByRole("button",{name:"Κατάλαβα"}).click();
    await expect(dlg).toHaveCount(0);
    await expect(page.getByRole("heading",{name:/μαγική ανακάλυψη/i})).toBeVisible();
  });

  test("critical views avoid overflow at 320, 390, 768 and 1440 widths", async ({page})=>{
    for(const width of [320,390,768,1440]){
      await page.setViewportSize({width,height:900});
      await page.goto(BASE+"/virtual-preschool");
      for(const section of ["Παιχνίδια","Κατασκευές","Ιστορίες"]){
        await page.getByRole("button",{name:section,exact:true}).click();
        const value=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:window.innerWidth}));
        expect(value.scroll,section+" width "+width).toBeLessThanOrEqual(value.inner+1);
      }
    }
  });
});
