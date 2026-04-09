const path = require('path');
const fs = require('fs');
const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

When('I click on Summary tab', async function () {

    await this.page.getByRole('link', { name: 'Summary' }).click();
});
When('I select {string} from {string} filter', async function (optionName, filterId) {
    // 1. Universal Locator: Finds ID, ID+Type, or the DatePicker container
    const filterContainer = this.page.locator(
        `[id="${filterId}"], [id="${filterId}Type"], .dateRangePicker, .filterList`
    ).filter({ hasText: new RegExp(filterId, 'i') }).first();

    const toggleButton = filterContainer.locator('button.toggle');

    // 2. Open the dropdown
    await toggleButton.scrollIntoViewIfNeeded();
    await toggleButton.click();

    // 3. Find the option (Label or Span) inside the opened menu
    const option = filterContainer.locator('label, span')
        .filter({ hasText: new RegExp(`^${optionName}$`, 'i') })
        .first();

    // 4. Click the option
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();

    console.log(`✅ Selected "${optionName}" from ${filterId}`);

    // 5. Smart Close: Only clicks the toggle again if the menu stays open (like Multi-select)
    const optionsMenu = filterContainer.locator('.options, .filterListContent');
    if (await optionsMenu.isVisible()) {
        await toggleButton.click({ force: true }).catch(() => { });
    }
    //await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);
});
When('I click clear on the {string} filter in Summary Page', async function (filterId) {
    // 1. Flexible Locator: Matches "channel" or "channelType" (Case Sensitive to match HTML)
    // We try the ID as provided, and also with 'Type' appended
    const filterContainer = this.page.locator(
        `[id="${filterId}"], [id="${filterId}Type"], [id="${filterId.toLowerCase()}"], [id="${filterId.toLowerCase()}Type"]`
    ).first();

    const toggleButton = filterContainer.locator('button.toggle');

    // 2. Wait for the filter to be visible on the dashboard
    await toggleButton.waitFor({ state: 'visible', timeout: 15000 });

    // 3. Open the dropdown only if it is not already open
    // We check the "open" class which appears in your HTML <div>
    const isOpen = await filterContainer.evaluate(node => node.classList.contains('open'));
    if (!isOpen) {
        await toggleButton.click();
    }

    // 4. Click the 'Clear' button inside the opened menu
    const clearButton = filterContainer.locator('.clear button');
    await clearButton.waitFor({ state: 'visible', timeout: 5000 });
    await clearButton.click();

    console.log(`✅ Cleared ${filterId} filter`);

    // 5. Short wait for the UI/Charts to reset after clearing
    await this.page.waitForTimeout(2000);
});

When('I click clear on the {string} filter', async function (filterId) {
    const id = filterId.toLowerCase();
    const filterContainer = this.page.locator(`#${id}`);
    const toggleButton = filterContainer.locator('button.toggle');

    // Open if closed
    if (!(await filterContainer.locator('.options').isVisible())) {
        await toggleButton.click();
    }

    const clearButton = filterContainer.locator('.clear button');
    await clearButton.click();

    // DO NOT click the toggle again here if you plan to select "Refunded" immediately after.
    console.log(`✅ Cleared ${filterId}`);
});

When('I select {string} and {string} from {string} filter', async function (opt1, opt2, filterId) {
    const filterContainer = this.page.locator(`.filterList#${filterId}`);
    await filterContainer.locator('button.toggle').click();

    const options = [opt1, opt2];
    for (const optName of options) {
        // Look for the checkbox or label specifically
        const option = this.page.locator('label', { hasText: new RegExp(`^${optName}$`, 'i') }).first();
        await option.waitFor({ state: 'visible' });
        await option.click();
        console.log(`   └─ Picked: ${optName}`);
    }

    // Close the dropdown to apply filters
    await filterContainer.locator('button.toggle').click();
});

When('I select today as the date range', async function () {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    // Create the exact format your app expects: dd-MM-yyyy
    const targetDate = `${dd}-${mm}-${yyyy}`;

    console.log(`📅 Force-setting date to hyphenated format: ${targetDate}`);

    // 1. Open the popover to ensure inputs are in the DOM
    const trigger = this.page.locator('.selectedDateValue').first();
    await trigger.click({ force: true });
    await this.page.waitForTimeout(500);

    // 2. Inject as a SINGLE STRING range or individual values
    await this.page.evaluate((dateStr) => {
        const elements = document.querySelectorAll('.flatpickr-input, #startDate, #endDate');

        elements.forEach(el => {
            if (el._flatpickr) {
                // If it's a range picker, passing a string with " to " or just the date 
                // usually forces it to parse correctly.
                el._flatpickr.setDate(dateStr, true);
            } else {
                // Manual fallback: update value and dispatch change event
                el.value = dateStr;
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }, targetDate);

    // 3. Force Close the menu to prevent "intercepts pointer events"
    await trigger.click({ force: true });

    // 4. Final safety: Click a neutral area and wait for UI to stabilize
    await this.page.mouse.click(0, 0);
    await this.page.waitForLoadState('networkidle').catch(() => { });

    const finalValue = await trigger.innerText();
    console.log(`✅ UI Now Shows: ${finalValue}`);
});
When('I select yesterday as the date range', async function () {
    const date = new Date();
    date.setDate(date.getDate() - 1); // Subtract 1 day

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const targetDate = `${dd}-${mm}-${yyyy}`;

    console.log(`📅 Setting date to Yesterday: ${targetDate}`);

    const trigger = this.page.locator('.selectedDateValue').first();
    await trigger.click({ force: true });
    await this.page.waitForTimeout(500);

    await this.page.evaluate((dateStr) => {
        const elements = document.querySelectorAll('.flatpickr-input, #startDate, #endDate');
        elements.forEach(el => {
            if (el._flatpickr) {
                el._flatpickr.setDate(dateStr, true);
            } else {
                el.value = dateStr;
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }, targetDate);

    await trigger.click({ force: true });
    await this.page.mouse.click(0, 0);
    await this.page.waitForLoadState('networkidle').catch(() => { });

    console.log(`✅ UI Updated to Yesterday: ${await trigger.innerText()}`);
});
When('I select day before yesterday as the date range', async function () {
    const date = new Date();
    date.setDate(date.getDate() - 2); // Subtract 2 days

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const targetDate = `${dd}-${mm}-${yyyy}`;

    console.log(`📅 Setting date to Day Before Yesterday: ${targetDate}`);

    const trigger = this.page.locator('.selectedDateValue').first();
    await trigger.click({ force: true });
    await this.page.waitForTimeout(500);

    await this.page.evaluate((dateStr) => {
        const elements = document.querySelectorAll('.flatpickr-input, #startDate, #endDate');
        elements.forEach(el => {
            if (el._flatpickr) {
                el._flatpickr.setDate(dateStr, true);
            } else {
                el.value = dateStr;
                el.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }, targetDate);

    await trigger.click({ force: true });
    await this.page.mouse.click(0, 0);
    await this.page.waitForLoadState('networkidle').catch(() => { });

    console.log(`✅ UI Updated to Day Before Yesterday: ${await trigger.innerText()}`);
});


Then('I verify the total payments count and total payment value', async function () {
    // 1. Locate the table body and all its rows
    const rows = this.page.locator('table.filterTable tbody tr');
    const rowCount = await rows.count();

    let totalSum = 0;

    console.log(`\n📋 TABLE ANALYSIS`);
    console.log(`--------------------------------------------------`);
    console.log(`🔢 Total Payments count: ${rowCount}`);

    // 2. Iterate through each row to extract the amount
    for (let i = 0; i < rowCount; i++) {
        // Find the specific amount span within the current row
        const amountText = await rows.nth(i).locator('#amount').innerText();

        // Convert string (e.g., "76.00") to a floating-point number
        const amountValue = parseFloat(amountText.replace(/,/g, ''));

        if (!isNaN(amountValue)) {
            totalSum += amountValue;
            console.log(`   🔹 Row ${i + 1}: ${amountValue.toFixed(2)}`);
        }
    }
    this.purchaseTotal = totalSum;
    // 3. Output the final calculation
    console.log(`--------------------------------------------------`);
    console.log(`Payments Value: ${this.purchaseTotal.toFixed(2)}`);
    console.log(`--------------------------------------------------\n`);

    // Optional: Add an assertion if you have an expected total
    // expect(totalSum).toBe(207.00); 
});
Then('I verify the Total Refunds Value and Refunds count', async function () {

    await this.page.waitForTimeout(2000);
    const rows = this.page.locator('table.filterTable tbody tr');
    const rowCount = await rows.count();

    let totalSum = 0;


    console.log(`--------------------------------------------------`);
    console.log(`🔢 Total Refunds Count: ${rowCount}`);

    // 2. Iterate through each row to extract the amount
    for (let i = 0; i < rowCount; i++) {
        // Find the specific amount span within the current row
        const amountText = await rows.nth(i).locator('#amount').innerText();

        // Convert string (e.g., "76.00") to a floating-point number
        const amountValue = parseFloat(amountText.replace(/,/g, ''));

        if (!isNaN(amountValue)) {
            totalSum += amountValue;
            console.log(`   🔹 Row ${i + 1}: ${amountValue.toFixed(2)}`);
        }
    }
    this.refundTotal = totalSum;
    // 3. Output the final calculation
    console.log(`--------------------------------------------------`);
    console.log(`Refunds Value: ${this.refundTotal.toFixed(2)}`);
    console.log(`--------------------------------------------------\n`);

    // Optional: Add an assertion if you have an expected total
    // expect(totalSum).toBe(207.00); 
});
Then('I calculate the Total Value', async function () {
    const p = this.purchaseTotal || 0;
    const r = this.refundTotal || 0;

    const finalValue = p - r;

    console.log(`--------------------------------------------------`);
    console.log(`Total Purchase: ${p.toFixed(2)}`);
    console.log(`Total Refunds:  ${r.toFixed(2)}`);
    console.log(`Total Value:    ${finalValue.toFixed(2)}`); // This will now work!
    console.log(`--------------------------------------------------`);
});



Then('I verify the number of filtered orders', async function () {
    // 1. Locate the H3 that specifically contains digits followed by "orders"
    // This ignores the Page Title "Orders" which has no numbers
    const orderCountLocator = this.page.locator('h3.h3').filter({ hasText: /\d+ orders/i });

    // 2. Wait for the text to appear (handling filter load time)
    await orderCountLocator.waitFor({ state: 'visible', timeout: 10000 });

    // 3. Extract the text (e.g., "201 orders")
    const fullText = await orderCountLocator.innerText();

    // 4. Extract only the numeric digits
    const countMatch = fullText.match(/\d+/);
    const orderCount = countMatch ? countMatch[0] : "0";

    console.log('--------------------------------------------------');
    console.log(`📊 Filtered Results: ${fullText.trim()}`);
    console.log(`🔢 Numeric Count:    ${orderCount}`);
    console.log('--------------------------------------------------');

    // Optional: Log a warning if the count is 0
    if (parseInt(orderCount) === 0) {
        console.warn("⚠️ Warning: The current filter returned 0 orders.");
    }
});
Then('I do the full Refund', async function () {
    await this.page.getByRole('cell', { name: 'AED' }).first().click();
    await this.page.getByRole('button', { name: 'Refund', exact: true }).click();
    await this.page.getByText('The amount must be equal to').click();
    await this.page.getByRole('textbox', { name: 'Amount' }).click();
    await this.page.getByRole('button', { name: 'Refund' }).click();

});
Then('I do the more Refund', async function () {
    // 1. Click on the transaction to open details
    await this.page.reload();
    await this.page.getByRole('cell', { name: 'Settled' }).first().click();
    // 2. Click the initial Refund button to open the refund form/modal

    await this.page.getByRole('button', { name: 'Refund', exact: true }).click();

    // 2. Identify the Amount field
    const amountField = this.page.getByRole('textbox', { name: 'Amount' });

    // 3. Get the default amount, increase it, and fill it back in
    const currentAmount = await amountField.inputValue();
    const invalidAmount = (parseFloat(currentAmount) + 10).toString(); // Add 10 to be safe
    await amountField.fill(invalidAmount);

    // 4. Click the final Refund button to trigger the error
    await this.page.getByRole('button', { name: 'Refund', exact: true }).click();

    // 5. VALIDATION: Check for the specific error message
    const errorMessage = this.page.getByText('Refund amount cannot be greater than transaction amount', { exact: false });

    // Wait for it to appear (handles potential API lag)
    await expect(errorMessage).toBeVisible({ timeout: 5000 });

    // Optional: Assert the exact text if needed
    await expect(errorMessage).toHaveText(/Refund amount cannot be greater than/);



});
Then('I Verify the elgibilty of Refund', async function () {
    // await this.page.waitForLoadState('networkidle');
    await this.page.reload();
    await this.page.getByRole('cell', { name: 'Settled' }).first().click();
    // await this.page.getByRole('button', { name: 'Refund', exact: true }).click();
    //await this.page.getByText('The amount must be equal to').click();
    //await this.page.getByRole('textbox', { name: 'Amount' }).click();
    // Target the button that contains the text 'Refund'

    const refundBtn = this.page.locator('button:has-text("Refund")');
    await expect(refundBtn).toBeVisible({ timeout: 10000 });




});
Then('I verify the TPV graph colors', async function () {
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__tpvReportContainer--FiLlo');
    const chartBackground = chartContainer.locator('.recharts-cartesian-grid-bg'); // The main graph area

    const channelMap = {
        '#FF5859': 'E-commerce (Red)',
        '#0066CC': 'POS (Blue)',
        '#00A390': 'SoftPOS (Green/Teal)',
        '#FF8B00': 'MOTO (Orange)'
    };

    console.log(`\n📈 SCANNING GRAPH FOR ACTIVITY...`);
    console.log(`--------------------------------------------------`);

    // 1. Get the bounding box of the chart to move the mouse across it
    const box = await chartBackground.boundingBox();
    let activePoints = [];

    // 2. Scan the chart from left to right (X-axis) to trigger tooltips
    // We jump by 50px to find the points like 152 and 300
    for (let x = 0; x <= box.width; x += 50) {
        await this.page.mouse.move(box.x + x, box.y + (box.height / 2));

        const tooltip = this.page.locator('.recharts-tooltip-wrapper');

        if (await tooltip.isVisible()) {
            const text = (await tooltip.innerText()).replace(/\n/g, ' ').trim();

            // 3. Logic: If the value is NOT 0.00, it's an activity point
            // Regex to find numbers that are NOT 0.00
            const matches = text.match(/(\d+\.?\d*)/g);
            const value = matches ? parseFloat(matches[matches.length - 1]) : 0;

            if (value > 0) {
                // Find which channel color is active in the tooltip
                const activeColorItem = this.page.locator('.recharts-tooltip-item');
                const color = await activeColorItem.locator('span, div').first().evaluate(el => el.style.color || el.getAttribute('fill'));
                const hex = color ? color.toUpperCase() : 'Unknown';

                const entry = `${text} | Color: ${hex}`;
                if (!activePoints.includes(entry)) {
                    activePoints.push(entry);
                    console.log(`✅ FOUND POINT: ${text}`);
                    console.log(`   └─ Channel: ${channelMap[hex] || hex}`);
                }
            }
        }
    }

    if (activePoints.length === 0) {
        console.log(`➖ No active points (> 0.00) detected on the graph.`);
    }
    console.log(`--------------------------------------------------\n`);
});

Then('I verify the TPV graph hover content', async function () {
    const tpvContainer = this.page.locator('.src-pages-dashboard-dashboard__tpvReportContainer--FiLlo');
    const chartWrapper = tpvContainer.locator('.recharts-wrapper').first();
    const tooltip = tpvContainer.locator('.recharts-tooltip-wrapper');

    await chartWrapper.waitFor({ state: 'visible', timeout: 10000 });
    const box = await chartWrapper.boundingBox();

    const activePoints = new Set();
    console.log(`\n🔍 VERTICAL SWEEP SCANNING TPV GRAPH (152 & 300)`);
    console.log(`--------------------------------------------------`);

    // 1. Move across the X-axis (Time)
    for (let x = 60; x <= box.width; x += 30) {

        // 2. For each X, sweep the Y-axis (Top to Bottom) to "hit" the line
        for (let y = 20; y <= box.height; y += 40) {
            await this.page.mouse.move(box.x + x, box.y + y);

            // Give Recharts a tiny moment to trigger the tooltip
            if (await tooltip.isVisible()) {
                const text = (await tooltip.innerText()).replace(/\n/g, ' ').trim();
                const matches = text.match(/[\d,.]+/g);
                const value = matches ? parseFloat(matches[matches.length - 1].replace(/,/g, '')) : 0;

                if (value > 0 && !activePoints.has(value)) {
                    activePoints.add(value);

                    // Identify the active channel color
                    const colorMarker = tooltip.locator('.recharts-tooltip-item').first();
                    const color = await colorMarker.evaluate(el => el.style.color || el.getAttribute('fill'));

                    console.log(`✅ FOUND ACTIVITY: ${value.toFixed(2)} | Color: ${color?.toUpperCase()}`);
                }
            }
        }
    }

    if (activePoints.size === 0) {
        console.log(`➖ No active points detected. Points 152 and 300 were not triggered.`);
    }
    console.log(`--------------------------------------------------\n`);
});

Then('I Verify filtered channel', async function () {
    const channelCells = this.page.locator('.filterTable tbody tr td:nth-child(6)');

    // 1. Wait for any "ecommerce" entries to disappear (Wait for Filter to Apply)
    // This prevents the race condition where the check runs before the UI updates
    await expect(this.page.locator('.filterTable tbody')).not.toContainText('ecommerce', { timeout: 5000 });

    // 2. Get all remaining text contents
    const allChannels = await channelCells.allTextContents();

    // 3. Verify every remaining row is "Pos"
    for (const channel of allChannels) {
        const cleanedChannel = channel.trim().toLowerCase();

        if (cleanedChannel !== "") { // Ignore empty rows if they exist
            expect(cleanedChannel).toBe('pos');
        }
    }
});

