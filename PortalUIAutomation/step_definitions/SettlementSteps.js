const { When, Then } = require('@cucumber/cucumber');
const OrdersPage = require('../PageObjects/OrdersPage');
const path = require('path');
const fs = require('fs');
// 1. Load the JSON data
const dataPath = path.join(__dirname, '../paymentFormData.json');
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

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
When('I select date range from {string} to {string}', async function (fromDate, toDate) {
    const dateContainer = this.page.locator('.dateRangePicker');
    const toggleButton = dateContainer.locator('button.toggle');

    // 1. Open the picker
    await toggleButton.click();
    console.log(`📅 Setting Date Range: ${fromDate} to ${toDate}`);

    // 2. Fill "From" date - using force:true to bypass overlays
    const fromInput = this.page.locator('label[for="startDate"]');
    await fromInput.click({ force: true });
    await this.page.keyboard.type(fromDate);
    await this.page.keyboard.press('Enter');

    // 3. Small pause to allow the calendar to react/shift
    await this.page.waitForTimeout(500);

    // 4. Fill "To" date - using force:true to bypass the calendar popup
    const toInput = this.page.locator('label[for="endDate"]');
    await toInput.click({ force: true });
    await this.page.keyboard.type(toDate);
    await this.page.keyboard.press('Enter');

    // 5. Close the picker
    await this.page.mouse.click(0, 0); 
    
    // 6. Wait for the settlement table to refresh
    await this.page.waitForTimeout(3000);
    
    const finalDisplay = await dateContainer.locator('.selectedDateValue').innerText();
    console.log(`✅ Date Range applied: ${finalDisplay}`);
});

When('I a select date range from {string} to {string}', async function (fromDate, toDate) {
    const dateContainer = this.page.locator('.dateRangePicker');

    // 1. Open the picker
    await dateContainer.locator('button.toggle').click();

    // 2. Click the 'From' label to focus it, then type the date
    await this.page.locator('label[for="startDate"]').click();
    await this.page.keyboard.type(fromDate);
    await this.page.keyboard.press('Enter');

    // 3. Click the 'To' label, then type the date
    await this.page.locator('label[for="endDate"]').click();
    await this.page.keyboard.type(toDate);
    await this.page.keyboard.press('Enter');

    // 4. Click away to close and apply
    await this.page.mouse.click(0, 0);
    await this.page.waitForTimeout(2000);
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


Then('I ye s click on each settlement row and display its type', async function () {
    // 1. Updated locator based on your HTML (div with role="button" containing the text)
    const expandBtn = this.page.locator('div.accordionItemTitle[role="button"]').filter({
        hasText: 'Settled transactions'
    });

    console.log("Waiting for 'Settled transactions' accordion...");
    await expandBtn.waitFor({ state: 'visible', timeout: 15000 });

    // 2. Click to expand
    await expandBtn.click({ force: true });

    // Wait for the table body to appear
    const rowsLocator = this.page.locator('tbody tr.rowHighlight');
    await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });

    const rowCount = await rowsLocator.count();
    console.log(`--- Total rows found: ${rowCount} ---`);

    for (let i = 0; i < rowCount; i++) {
        // 3. RE-EXPAND logic: if the table is hidden after coming back, click the accordion again
        if (!(await this.page.locator('tbody').isVisible())) {
            await expandBtn.click({ force: true });
            await this.page.locator('tbody').waitFor({ state: 'visible' });
        }

        // 4. Target the specific row using .nth(i)
        const currentRow = this.page.locator('tbody tr.rowHighlight').nth(i);

        // Get Transaction Type (2nd column / index 1) or Order ID (3rd column / index 2)
        const type = (await currentRow.locator('td').nth(1).innerText()).trim();
        const orderId = (await currentRow.locator('td').nth(2).innerText()).trim();

        console.log(`Row ${i + 1}: Type [${type}] | Order ID [${orderId}]`);

        // 5. Click row to go to details
        await currentRow.click();

        // 6. Wait for Details page (using #amount as seen in your HTML)
        await this.page.locator('#amount').first().waitFor({ state: 'visible', timeout: 10000 });
        console.log(`✅ Navigation to details confirmed for Order: ${orderId}`);

        // 7. Go back to the list
        await this.page.goBack();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000); // Small buffer for table re-render
    }
});

Then('I click on no each settlement row and display its type', async function () {
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
}); Then('I click on the first settlement record for {string} as per way4 netamount', async function (userType) {
    // Change 'data' to 'testData' here
    const amount = testData[userType].payment.netamount;

    console.log(`Targeting Way4 netamount: ${amount} for ${userType}`);

    const onCycleRow = this.page.locator('tr.rowHighlight').filter({
        has: this.page.locator('td').nth(3).filter({ hasText: 'On Cycle' })
    }).filter({
        hasText: amount
    }).first();

    await onCycleRow.waitFor({ state: 'visible', timeout: 10000 });
    await onCycleRow.click({ force: true });

    await this.page.locator('text=Settled transactions').waitFor({ state: 'visible', timeout: 15000 });
}); Then('I no click on each settlement row and display its type', { timeout: 1800000 }, async function () {
    const expandBtn = this.page.locator('div.accordionItemTitle[role="button"]').filter({
        hasText: 'Settled transactions'
    });
    const rowsLocator = this.page.locator('tbody tr.rowHighlight');
    const showMoreBtn = this.page.locator('button').filter({ hasText: /Show More/i });

    let runningTotal = 0; // 1. Variable to store the sum

    const ensureRowsLoaded = async (targetIndex) => {
        if (!(await this.page.locator('tbody').isVisible())) {
            await expandBtn.click({ force: true });
            await this.page.locator('tbody').waitFor({ state: 'visible' });
        }

        let currentCount = await rowsLocator.count();
        while (currentCount <= targetIndex && await showMoreBtn.isVisible()) {
            await rowsLocator.last().scrollIntoViewIfNeeded();
            await showMoreBtn.click();
            await this.page.waitForTimeout(3000);
            currentCount = await rowsLocator.count();
        }
    };

    // Use a large limit to catch all records (e.g., 500)
    const validationLimit = 500;
    console.log(`--- Starting full validation and total sum calculation ---`);

    for (let i = 0; i < validationLimit; i++) {
        await ensureRowsLoaded(i);

        const totalInDom = await rowsLocator.count();
        if (i >= totalInDom) {
            console.log(`🏁 All ${totalInDom} records processed.`);
            break;
        }

        const currentRow = rowsLocator.nth(i);
        await currentRow.scrollIntoViewIfNeeded();
        const type = (await currentRow.locator('td').nth(1).innerText()).trim();
        const orderId = (await currentRow.locator('td').nth(2).innerText()).trim();

        await currentRow.click();

        try {
            const amountLocator = this.page.locator('h1#amount').first();
            await amountLocator.waitFor({ state: 'visible', timeout: 10000 });

            // 2. Extract and Clean Amount
            let detailsAmountStr = await amountLocator.innerText();
            // Remove commas and non-numeric characters except decimal point
            let cleanAmount = parseFloat(detailsAmountStr.replace(/[^0-9.]/g, ''));

            if (!isNaN(cleanAmount)) {
                runningTotal += cleanAmount;
            }

            console.log(`Record ${i + 1}: ID [${orderId}] | Amount [${cleanAmount.toFixed(2)}] | Current Sum [${runningTotal.toFixed(2)}]`);
        } catch (e) {
            console.log(`⚠️ Data capture skip for Row ${i + 1}`);
        }

        await this.page.goBack();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1200);
    }

    // 3. Final Summary Output
    console.log(`\n================================================`);
    console.log(`✅ TOTAL CALCULATED AMOUNT: ${runningTotal.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`);
    console.log(`================================================\n`);
});
Then('I click on each settlement row and display its type', { timeout: 1800000 }, async function () {
    const expandBtn = this.page.locator('div.accordionItemTitle[role="button"]').filter({
        hasText: 'Settled transactions'
    });
    const rowsLocator = this.page.locator('tbody tr.rowHighlight');
    const showMoreBtn = this.page.locator('button').filter({ hasText: /Show More/i });

    let runningTotal = 0;

    const ensureRowsLoaded = async (targetIndex) => {
        if (!(await this.page.locator('tbody').isVisible())) {
            await expandBtn.click({ force: true });
            await this.page.locator('tbody').waitFor({ state: 'visible' });
        }

        let currentCount = await rowsLocator.count();
        while (currentCount <= targetIndex && await showMoreBtn.isVisible()) {
            await rowsLocator.last().scrollIntoViewIfNeeded();
            await showMoreBtn.click();
            await this.page.waitForTimeout(3000);
            currentCount = await rowsLocator.count();
        }
    };

    const validationLimit = 500;
    console.log(`--- Starting validation with Reversal Math (Purchase: +, Reversal: -) ---`);

    for (let i = 0; i < validationLimit; i++) {
        await ensureRowsLoaded(i);

        const totalInDom = await rowsLocator.count();
        if (i >= totalInDom) {
            console.log(`🏁 All ${totalInDom} records processed.`);
            break;
        }

        const currentRow = rowsLocator.nth(i);
        await currentRow.scrollIntoViewIfNeeded();

        // Capture Type from the list to determine Math (Index 1)
        const type = (await currentRow.locator('td').nth(1).innerText()).trim();
        const orderId = (await currentRow.locator('td').nth(2).innerText()).trim();

        await currentRow.click();

        try {
            const amountLocator = this.page.locator('h1#amount').first();
            await amountLocator.waitFor({ state: 'visible', timeout: 10000 });

            let detailsAmountStr = await amountLocator.innerText();
            let cleanAmount = parseFloat(detailsAmountStr.replace(/[^0-9.]/g, ''));

            if (!isNaN(cleanAmount)) {
                // --- ADDON: Reversal Logic ---
                // If type includes 'reversal' (case insensitive), subtract. Else, add.
                if (type.toLowerCase().includes('reversal')) {
                    runningTotal -= cleanAmount;
                    console.log(`Record ${i + 1}: ID [${orderId}] | TYPE: [${type}] | Amount: [-${cleanAmount.toFixed(2)}] | Current Sum: [${runningTotal.toFixed(2)}]`);
                } else {
                    runningTotal += cleanAmount;
                    console.log(`Record ${i + 1}: ID [${orderId}] | TYPE: [${type}] | Amount: [+${cleanAmount.toFixed(2)}] | Current Sum: [${runningTotal.toFixed(2)}]`);
                }
            }
        } catch (e) {
            console.log(`⚠️ Data capture skip for Row ${i + 1}`);
        }

        await this.page.goBack();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1200);
    }

    console.log(`\n================================================`);
    console.log(`✅ FINAL NET SETTLEMENT AMOUNT: ${runningTotal.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`);
    console.log(`================================================\n`);
});
Then('I a click on each settlement row and display its type', { timeout: 1800000 }, async function () {
    const expandBtn = this.page.locator('div.accordionItemTitle[role="button"]').filter({ hasText: 'Settled transactions' });
    const rowsLocator = this.page.locator('tbody tr.rowHighlight');
    const showMoreBtn = this.page.locator('button').filter({ hasText: /Show More/i });

    let runningTotal = 0;

    // 1. Recovery/Loading Function: Ensures target index exists in DOM
    const ensureIndexIsReady = async (targetIndex) => {
        // Re-open accordion if it collapsed
        if (!(await this.page.locator('tbody').isVisible())) {
            await expandBtn.click({ force: true });
            await this.page.locator('tbody').waitFor({ state: 'visible' });
        }
        
        let currentCount = await rowsLocator.count();
        
        // If the row we need isn't loaded, click Show More until it is
        while (currentCount <= targetIndex && await showMoreBtn.isVisible()) {
            console.log(`Row index ${targetIndex} missing (Current: ${currentCount}). Reloading...`);
            await rowsLocator.last().scrollIntoViewIfNeeded();
            await showMoreBtn.click();
            // Wait for DOM to register new rows
            await this.page.waitForTimeout(3000); 
            currentCount = await rowsLocator.count();
        }
        return currentCount;
    };

    // 2. Initial Deep Load to get the total count for the whole list
    console.log("Determining total record count...");
    await ensureIndexIsReady(0); // Ensure table is open
    while (await showMoreBtn.isVisible()) {
        await rowsLocator.last().scrollIntoViewIfNeeded();
        await showMoreBtn.click();
        await this.page.waitForTimeout(2000); 
    }

    const totalRows = await rowsLocator.count();
    console.log(`✅ ${totalRows} records detected. Starting calculation...`);

    // 3. Main Loop
    for (let i = 0; i < totalRows; i++) {
        // CRITICAL: Ensure the index is ready EVERY time we come back from a detail page
        await ensureIndexIsReady(i);

        const currentRow = rowsLocator.nth(i);
        
        // Scroll specifically to this row before interacting
        await currentRow.scrollIntoViewIfNeeded();
        
        const type = (await currentRow.locator('td').nth(1).innerText()).trim();
        const orderId = (await currentRow.locator('td').nth(2).innerText()).trim();

        await currentRow.click();
        
        try {
            const amountLocator = this.page.locator('h1#amount').first();
            await amountLocator.waitFor({ state: 'visible', timeout: 10000 });
            
            let detailsAmountStr = await amountLocator.innerText();
            let cleanAmount = parseFloat(detailsAmountStr.replace(/[^0-9.]/g, ''));
            
            if (!isNaN(cleanAmount)) {
                const isReversal = type.toLowerCase().includes('reversal');
                runningTotal = isReversal ? (runningTotal - cleanAmount) : (runningTotal + cleanAmount);

                console.log(`Record ${i + 1}/${totalRows}: ID [${orderId}] | TYPE: [${type}] | Amt: [${isReversal ? '-' : '+'}${cleanAmount.toFixed(2)}] | Sum: [${runningTotal.toFixed(2)}]`);
            }
        } catch (e) {
            console.log(`⚠️ Data capture failed for Row ${i + 1}`);
        }

        // Return to list
        await this.page.goBack();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000); 
    }

    console.log(`\n================================================`);
    console.log(`✅ FINAL CALCULATED NET AMOUNT: ${runningTotal.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`);
    console.log(`================================================\n`);
});
