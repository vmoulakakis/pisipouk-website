import { test, expect } from '@playwright/test';

const base = process.env.PRESCHOOL_BASE_URL || 'http://127.0.0.1:4173';
const url = `${base}/virtual-preschool`;

test('V9 home exposes eight child-choice worlds', async ({ page }) => {
  await page.goto(url);
  await expect(page.getByText('Ο ΚΟΣΜΟΣ ΤΟΥ ΠΙΣΙΠΟΥΚ')).toBeVisible();
  for (const label of ['Παίζω & Ανακαλύπτω','Λέξεις & Ήχοι','Αριθμοί & Λογική','Δημιουργώ','Ιστορίες του Πισιπούκ','Φύση & STEM','Μουσική & Κίνηση','Συναισθήματα & Ζωή']) {
    await expect(page.locator('.v9-world').filter({ hasText: label })).toBeVisible();
  }
});

test('age selection changes active experience', async ({ page }) => {
  await page.goto(url);
  await page.getByRole('button', { name: /2–3 ετών/ }).click();
  await page.locator('.v9-world').filter({ hasText: 'Παίζω & Ανακαλύπτω' }).click();
  await expect(page.getByText('επιλεγμένη ηλικία 2–3 ετών')).toBeVisible();
});

test('new micro-game opens and gives feedback', async ({ page }) => {
  await page.goto(url);
  await page.locator('.v9-world').filter({ hasText: 'Παίζω & Ανακαλύπτω' }).click();
  await page.getByRole('button', { name: /Ποια σκιά ταιριάζει/ }).click();
  await expect(page.getByText('Ποια σκιά ταιριάζει σε ένα καραβάκι;')).toBeVisible();
  await page.locator('.v9-options button').filter({ hasText: '⛵' }).click();
  await expect(page.getByText('Μπράβο!')).toBeVisible();
});

test('language world contains story maker', async ({ page }) => {
  await page.goto(url);
  await page.locator('.v9-world').filter({ hasText: 'Λέξεις & Ήχοι' }).click();
  await expect(page.getByText('Φτιάχνω δική μου ιστορία')).toBeVisible();
  await expect(page.getByRole('button', { name: /Άκου την αρχή/ })).toBeVisible();
});

test('math world contains open-ended builder', async ({ page }) => {
  await page.goto(url);
  await page.locator('.v9-world').filter({ hasText: 'Αριθμοί & Λογική' }).click();
  await expect(page.getByText('Χτίζω τον κόσμο μου')).toBeVisible();
  await page.getByRole('button', { name: '🏠' }).click();
});

test('creation world exposes craft library and drawing themes', async ({ page }) => {
  await page.goto(url);
  await page.locator('.v9-world').filter({ hasText: 'Δημιουργώ' }).click();
  await expect(page.getByText('Ο Πισιπούκ από χαρτί')).toBeVisible();
  await page.getByRole('button', { name: /Το νησί του Πισιπούκ/ }).click();
  await expect(page.locator('.v9-paper-title').filter({ hasText: 'Το νησί του Πισιπούκ' })).toBeVisible();
  await expect(page.locator('canvas')).toBeVisible();
});

test('stories use owned in-app player', async ({ page }) => {
  await page.goto(url);
  await page.locator('.v9-world').filter({ hasText: 'Ιστορίες του Πισιπούκ' }).click();
  await page.getByRole('button', { name: /Ο Πισιπούκ και το χαμένο αστέρι/ }).click();
  await expect(page.getByText('Ένα βράδυ ένα μικρό αστέρι')).toBeVisible();
  await expect(page.locator('.v9-storyplayer')).toBeVisible();
});

test('STEM world is not just quizzes', async ({ page }) => {
  await page.goto(url);
  await page.locator('.v9-world').filter({ hasText: 'Φύση & STEM' }).click();
  await expect(page.getByText('Μικρό εργαστήριο παρατήρησης')).toBeVisible();
});

test('music world exposes movement and rhythm lab', async ({ page }) => {
  await page.goto(url);
  await page.locator('.v9-world').filter({ hasText: 'Μουσική & Κίνηση' }).click();
  await expect(page.getByText('Εργαστήριο ρυθμού')).toBeVisible();
  await expect(page.locator('.v9-soundpads button').filter({ hasText: '🥁' })).toBeVisible();
});

test('parent zone explains privacy and monthly refresh', async ({ page }) => {
  await page.goto(url);
  await page.getByRole('button', { name: /Γονείς/ }).click();
  await expect(page.getByText(/Χωρίς ads/)).toBeVisible();
  await expect(page.getByText(/κάθε μήνα/)).toBeVisible();
});

test('mobile layout keeps primary worlds tappable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);
  const world = page.locator('.v9-world').filter({ hasText: 'Παίζω & Ανακαλύπτω' });
  await expect(world).toBeVisible();
  await world.click();
  await expect(page.locator('.v9-panelhead h2').filter({ hasText: 'Παίζω & Ανακαλύπτω' })).toBeVisible();
});
