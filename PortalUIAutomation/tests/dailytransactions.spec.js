import { test, expect } from '@playwright/test';
const users = require('../users.json');

test.use({
  storageState: 'enableTransactions.json'
});

test('Calculate Today\'s Transaction Total', async ({ page }) => {
  // --- Navigation and Login ---
  await page.goto('https://portal.sandbox.ngenius-payments.com/#/summary_for_merchants/');
  await page.getByRole('textbox', { name: 'Email' }).fill(users[0].mcpuser);
  await page.getByRole('textbox', { name: 'Password' }).fill(users[0].mcppassword);
  await page.getByRole('button', { name: 'Log In' }).click();
  
  await page.getByRole('link', { name: 'Orders' }).click();
  await page.getByRole('link', { name: 'Transactions' }).click();

  // --- Date Selection ---
  await page.locator('.selectedDateValue').click();
  await page.getByText('From').click();

  // Select "Today" from the Flatpickr calendar
  const todate = page.locator('.dayContainer .flatpickr-day.today').filter({ visible: true });
  await todate.click({ force: true });
  await page.keyboard.press('Enter');

  // --- Step 1: Generate Today's Date String ---
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const todayDate = `${dd}/${mm}/${yyyy}`; // Corrected with backticks
  console.log('Today date is: ' + todayDate);

  // --- Step 2: Load All Rows (Pagination) ---
  const showMoreBtn = page.getByRole('button', { name: /show more/i });
  while (await showMoreBtn.isVisible()) {
    await showMoreBtn.click();
    // Wait for the new rows to actually attach to the DOM
    await page.waitForLoadState('networkidle'); 
    await page.waitForTimeout(500); 
  }

  // --- Step 3: Filter Today's Rows ---
  // Fix 1: Corrected 'tobody' to 'tbody'
  // Fix 2: Used backticks for string interpolation in locator
  const rows = page.locator('tbody tr').filter({
    has: page.locator(`td:has-text("${todayDate}")`)
  });
  await page.locator('tbody tr').first().waitFor(); 
 // console.log("First row text:", await page.locator('tbody tr').first().innerText());

  // --- Step 4: Calculate Total ---
  let total = 0;
  const count = await rows.count();
  console.log(`Found ${count} transactions for ${todayDate}`);

  for (let i = 0; i < count; i++) {
    // Get the amount from the specific row. 
    // We target span#amount as per your HTML description.
    const amountText = await rows.nth(i).locator('#amount').innerText();
     console.log(`Amount for row ${i + 1}: ${amountText}`);
    
    const value = parseFloat(amountText);

    if (!isNaN(value)) {
      total += value;
    }
  }

  console.log(`Total amount for ${todayDate}: AED ${total.toFixed(2)}`);
  
});

