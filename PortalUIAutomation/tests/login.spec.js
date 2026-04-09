// @ts-check
import { test, expect } from '@playwright/test';
import { text } from 'node:stream/consumers';

test.use({
  storageState: 'enableTransactions.json'
});


test('Launch Portal App', async ({ page }) => { 


  await page.goto('https://portal.sandbox.ngenius-payments.com');
  
  await expect(page).toHaveTitle(/Log in to ni/);

  await page.getByLabel('Email').fill('abhranl.ghosh@network.global');
 
  await page.getByLabel('Password').fill('October@@2025##');
 
  await page.getByRole('button',{name:'Log in'}).click();
 
  await expect(page).toHaveTitle(/Network International/);

  await page.getByLabel('MDE UAT LLC').isVisible();

  await page.getByRole('link', { name: 'Orders' }).click();
  
  await page.getByLabel('View orders').isVisible();

  await page.getByRole('link', { name: 'Transactions' }).click();


   await page.getByLabel('Transaction details').isVisible();

   //Transaction Search table

   const table = await page.locator("table.filterTable.tableLayoutFixed");

   await table.locator("tbody tr").first().waitFor({timeout: 10000});

   const cols = await table.locator("thead tr th");

   const rows = await table.locator("tbody tr");

   
  const columnNames = await cols.allTextContents();

  console.log("Column Names:", columnNames);


   console.log("number of columns:", await cols.count());

   console.log("number of rows:", await rows.count());

   // select based on the outlet

  const matchedRow=  rows.filter({

      has: page.locator('td'),
      hasText:'Carrefou City Center Ajman'
      
    }).filter({
      hasText:'Declined'
    });

    const count =await matchedRow.count();

    const rowstext= await matchedRow.allInnerTexts();

    console.log('Declined Transactions: ',count);

     rowstext.forEach(text =>console.log(text));
 
  //const displayedText =  await matchedRow.first().innerText();

 // console.log('Declined rows:', displayedText);

 // 1. Generate today's date in DD/MM/YYYY format
const today = new Date().toLocaleDateString('en-GB'); 
// For 26/01/2026, this outputs: "26/01/2026"

// 2. Locate the element and get its text
const dateLocator = page.locator('#date-time').first();
const dateValue = await dateLocator.innerText();

// 3. Validate they match

expect(dateValue).toBe(today);






});
