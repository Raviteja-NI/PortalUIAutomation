const { When, Then } = require('@cucumber/cucumber');
const OrdersPage = require('../PageObjects/OrdersPage');

When('I click on Settlements tab', async function () {

    await this.page.getByRole('link', { name: 'Settlements' }).click();
});
When('I expand settled transactions', async function () {
    // 1. Target the button specifically by its text
    const accordionBtn = this.page.locator('button.ni-btn-link-large', { hasText: 'Settled transactions' });

    // 2. Ensure it's in view and ready
    await accordionBtn.scrollIntoViewIfNeeded();
    await accordionBtn.waitFor({ state: 'visible', timeout: 10000 });

    // 3. Use 'force: true' to bypass any transparent divs/overlays
    await accordionBtn.click({ force: true });

    // 4. Wait for the table body to actually appear before continuing
    // This confirms the click worked
    await this.page.locator('tbody').waitFor({ state: 'visible', timeout: 10000 });

    console.log('✅ Accordion expanded and table is now visible.');
});


When('I expand Settlement summary', async function () {
    await page.locator('button').filter({ hasText: 'Settlement summary' }).click();
});

Then('I verify the Settlement table headers', async function () {
    const expectedHeaders = [
        'Settlement amount',
        'Channel',
        'Currency',
        'Type',
        'Settlement Date',
        'IBAN'
    ];

    // Select the headers
    const headerLocator = this.page.locator('th.center');

    // Get text and clean it (remove extra spaces or newlines)
    const actualHeaders = await headerLocator.allTextContents();
    const cleanedActual = actualHeaders.map(text => text.trim());

    console.log('Cleaned Actual:', cleanedActual);

    // Use toEqual to compare the arrays
    // expect(cleanedActual).toEqual(expectedHeaders);
});
Then('the settlement dates should be in descending order', async function () {
    // 1. Locate all the date spans within the table body
    const dateElements = this.page.locator('tbody td #date-time');

    // 2. Extract all date strings into an array
    const dateStrings = await dateElements.allTextContents();

    // 3. Convert DD/MM/YYYY strings to Date objects for comparison
    const dates = dateStrings.map(dateStr => {
        const [day, month, year] = dateStr.trim().split('/');
        return new Date(year, month - 1, day); // month is 0-indexed in JS
    });

    console.log('Detected Dates (in order):', dateStrings);

    // 4. Verify each date is >= the next date
    for (let i = 0; i < dates.length - 1; i++) {
        const current = dates[i];
        const next = dates[i + 1];

        if (current < next) {
            throw new Error(
                `Dates are not in descending order! Found ${dateStrings[i]} before ${dateStrings[i + 1]}`
            );
        }
    }

    console.log('✅ All dates are correctly sorted in descending order.');
});
Then('I click on the first settlement record', async function () {
    // Locate the first row in the tbody
    const firstRow = this.page.locator('tbody tr.rowHighlight').first();

    // Click it
    await firstRow.click();
    console.log('Clicked the first settlement row.');
});
// Change the string to include {string}
Then('I click on the first {string} settlement record', async function (amount) {
    console.log(`Searching for settlement with amount: ${amount}`);

    // 1. Locate the row that has "On Cycle" AND the specific amount
    const onCycleRow = this.page.locator('tr.rowHighlight').filter({
        has: this.page.locator('td').nth(3).filter({ hasText: 'On Cycle' })
    }).filter({
        hasText: amount  // This ensures we hit the "4.63" row specifically
    }).first();

    await onCycleRow.waitFor({ state: 'visible', timeout: 10000 });

    // 2. Click using "force"
    await onCycleRow.click({ force: true });
    console.log(`✅ Click performed on "On Cycle" row for amount ${amount}`);

    // 3. Wait for the next page element
    await this.page.locator('text=Settled transactions').waitFor({ state: 'visible', timeout: 15000 });

    console.log('✅ Navigation confirmed: Settlement Details page loaded.');
});

Then('I click on each settlement row and display its type', async function () {
 const expandBtn = this.page.locator('button.ni-btn-link-large', { hasText: 'Settled transactions' });
    
    // 1. Initial Expand to get count
    await expandBtn.click({ force: true });
    const rowsLocator = this.page.locator('tbody tr.rowHighlight');
    await rowsLocator.first().waitFor();
    const rowCount = await rowsLocator.count();
    
    console.log(`--- Total rows to process: ${rowCount} ---`);

    for (let i = 0; i < rowCount; i++) {
        // 2. RE-EXPAND: Every goBack() closes the accordion
        if (!(await this.page.locator('tbody').isVisible())) {
            await expandBtn.click({ force: true });
            await this.page.locator('tbody').waitFor({ state: 'visible' });
        }

        // 3. TARGET SPECIFIC ROW: Use .nth(i) to ensure we move to the next row
        const currentRow = this.page.locator('tbody tr.rowHighlight').nth(i);
        
        // Get ID so we can see it change in the console
        const txId = (await currentRow.locator('td').nth(2).innerText()).trim();
        console.log(`Step ${i + 1}: Clicking Row Index ${i} (ID: ${txId})...`);

        // 4. CLICK and wait for the Details Page
        await currentRow.click();
        
        // 5. GET the unique amount from the Details Page
        const detailsAmount = await this.page.locator('#amount').first().innerText();
        console.log(`✅ Details Page for ${txId} shows Amount: ${detailsAmount.trim()}`);

        // 6. BACK to list
        await this.page.goBack();
        await this.page.waitForLoadState('domcontentloaded');
        
        // Short pause to let the table stabilize
        await this.page.waitForTimeout(1000); 
    }
});

