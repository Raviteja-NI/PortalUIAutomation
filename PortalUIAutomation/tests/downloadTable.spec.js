import { test } from '@playwright/test';
const ExcelJS = require('exceljs');

test.use({
  storageState: 'enableTransactions.json'
});

test('Extract All Table Pages to Excel', async ({ page }) => {
  await page.goto('https://portal.sandbox.ngenius-payments.com');
  await page.getByRole('textbox', { name: 'Email' }).fill('abhranil.ghosh+mcp@network.global');
  await page.getByRole('textbox', { name: 'Password' }).fill('October@@2025##');
  await page.getByRole('button', { name: 'Log In' }).click();
  
  await page.getByRole('link', { name: 'Orders' }).click();
  await page.getByRole('link', { name: 'Transactions' }).click();
  
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Transactions');
  worksheet.columns = [
    { header: 'Date', key: 'date', width: 20 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Status', key: 'status', width: 15 }
  ];

  let hasNextPage = true;

  while (hasNextPage) {
    // 1. Extract data from the current page
    const rows = page.locator('tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const date = await row.locator('td').nth(1).innerText();
      const amount = await row.locator('#amount').innerText();
      const status = await row.locator('td').nth(4).innerText();
      worksheet.addRow({ date, amount, status });
    }

    // 2. Check for "Next" button and click it
    const nextButton = page.locator('button.next-page-selector'); // Replace with actual selector
    const isEnabled = await nextButton.isEnabled().catch(() => false);

    if (isEnabled) {
      await nextButton.click();
      // Wait for table to reload/update after clicking
      await page.waitForTimeout(1000); 
    } else {
      hasNextPage = false;
    }
  }

  await workbook.xlsx.writeFile('Full_Transactions_Report.xlsx');
  console.log('All pages extracted and Excel file saved!');
});
