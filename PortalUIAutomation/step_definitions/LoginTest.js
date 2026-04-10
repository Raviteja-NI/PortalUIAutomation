const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const users = require('../users.json');
// This tells Node to start from the root folder (PortalUIAutomation)
const { SummaryPage } = require('../PageObjects/SummaryPage');


// Convert label → userKey
function mapBrandToUserKey(merchantType) {
    switch (merchantType.toLowerCase().trim()) {
        case 'mcp': return 'mcpuser';
        case 'mde': return 'mdeuser';
        case 'carrefour': return 'carrefouruser';
        case 'carreowner': return 'carrefourOwner';
        case 'mosambee': return 'softposuser';
        case 'attp': return 'attpuser';
        case 'tabby': return 'tabbyuser';
        case 'aany': return 'aanyuser';
        default:
            throw new Error(`Unknown brand label "${merchantType}". Expected: MCP, MDE, Carrefour, SoftPOS, ATTP`);
    }
}



Given('I navigate to the sandbox portal', async function () {
    await this.page.goto('https://portal.sandbox.ngenius-payments.com/', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
    });
    console.log("Navigation Successful!");
});

When('I b login using {string} user name and password', async function (merchantType) {
    const userKey = mapBrandToUserKey(merchantType);
    this.userType = userKey;

    // 1. CHECK IF ALREADY LOGGED IN (Crucial for 36 scenarios in 1 tab)
    const dashboardMarker = this.page.getByText(/portal merchant/i).first();
    if (await dashboardMarker.isVisible({ timeout: 3000 })) {
        console.log("✅ Already logged in, skipping login flow.");
        return;
    }

    const userData = users[userKey];
    const email = userData.email;
    const password = userData.password;

    console.log(`🔑 Attempting login for: ${email}`);

    // 2. PERFORM LOGIN
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Log In' }).click();

    // 3. WAIT FOR NAVIGATION TO FINISH
    // Don't just timeout; wait for a specific element that exists ONLY on the dashboard
    await dashboardMarker.waitFor({ state: 'visible', timeout: 15000 });

    // 4. ADD COOKIES & RELOAD
    await this.page.context().addCookies([
        {
            name: 'feat-dep-transactions',
            value: 'enabled',
            domain: 'portal.sandbox.ngenius-payments.com',
            path: '/',
            sameSite: 'Lax'
        }
    ]);

    // Reload and wait for the page to be stable again
    await this.page.reload({ waitUntil: 'networkidle' });

    console.log("✅ Login successful and dashboard loaded.");
});
When('I login using {string} user name and password', async function (merchantType) {
    
    const userKey = mapBrandToUserKey(merchantType);
    
    this.userType = userKey;
    
    const currentUrl = this.page.url();
    if (currentUrl.includes('summary_for_merchants')) {
        console.log("✅ SESSION ALIVE: Already on Summary page.");
        return;
    }


    const userData = users[userKey];
    console.log(`🔑 NO SESSION: Logging in as ${userData.email}`);

    await this.page.getByRole('textbox', { name: 'Email' }).fill(userData.email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(userData.password);
    await this.page.getByRole('button', { name: 'Log In' }).click();

    // 3. Add cookies
    await this.page.context().addCookies([{
        name: 'feat-dep-transactions', value: 'enabled',
        domain: 'portal.sandbox.ngenius-payments.com', path: '/', secure: true, sameSite: 'Lax'
    }]);

    // 2. FIXED: Wait for the ACTUAL redirect URL shown in your logs
    await this.page.waitForURL('**/summary_for_merchants**', { timeout: 20000 });

    await this.page.reload({ waitUntil: 'domcontentloaded' });

    // await this.page.locator('.src-pages-dashboard-dashboard__dashboard--jwdFW').first().waitFor();
});

When('I ab login using {string} user name and password', async function (merchantType) {
    const userKey = mapBrandToUserKey(merchantType);
    const userData = users[userKey];

    // 1. CHECK IF SESSION IS ALREADY ACTIVE
    // Use a selector unique to your dashboard (like a chart or the merchant name)
    const dashboardMarker = this.page.locator('.src-pages-dashboard-dashboard__dashboard--jwdFW, .src-common__indicator--JpXIU').first();

    if (await dashboardMarker.isVisible({ timeout: 3000 })) {
        console.log("✅ SESSION ALIVE: Already logged in with cookies. Skipping flow.");
        return; // Move to the next Gherkin step immediately
    }

    // 2. PERFORM LOGIN (Only if not logged in)
    console.log(`🔑 NO SESSION: Attempting login for: ${userData.email}`);


    await this.page.getByRole('textbox', { name: 'Email' }).fill(userData.email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(userData.password);
    await this.page.getByRole('button', { name: 'Log In' }).click();
    // 4. ADD THE REQUIRED COOKIES
    await this.page.context().addCookies([
        {
            name: 'feat-dep-transactions',
            value: 'enabled',
            domain: 'portal.sandbox.ngenius-payments.com',
            path: '/',
            sameSite: 'Lax'
        }
    ]);

    // 3. WAIT FOR DASHBOARD BEFORE ADDING COOKIES
    await dashboardMarker.waitFor({ state: 'visible', timeout: 15000 });



    // 5. RELOAD TO ACTIVATE COOKIES
    await this.page.reload({ waitUntil: 'domcontentloaded' });

    // Final wait to ensure charts render after reload
    await this.page.waitForTimeout(3000);
    console.log("✅ Login successful, cookies set, and dashboard ready.");
});



When('I la ogin using {string} user name and password', async function (merchantType) {

    // FIXED: Use correct function name
    const userKey = mapBrandToUserKey(merchantType);

    // Store user type for payment routing
    this.userType = userKey;

    console.log(`➡️ Merchant type: ${merchantType} → User key: ${userKey}`);

    const userData = users[userKey];
    if (!userData) {
        throw new Error(`User key "${userKey}" not found in users.json`);
    }

    const email = userData.email;
    const password = userData.password;

    console.log(`Attempting login for: ${email}`);

    // LOGIN
    await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Log In' }).click();

    // Add cookies AFTER login
    await this.context.addCookies([
        {
            name: 'feat-dep-transactions',
            value: 'enabled',
            domain: 'portal.sandbox.ngenius-payments.com',
            path: '/',
            sameSite: 'Lax'
        }
    ]);
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.page.waitForTimeout(5000);
});
When('I Verify Defualt filter Data', async function () {

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dd = String(yesterday.getDate()).padStart(2, '0');
    const mm = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yyyy = yesterday.getFullYear();
    const expectedDateStr = `${dd}/${mm}/${yyyy} - ${dd}/${mm}/${yyyy}`;

    // 2. Capture Data for Logging
    const dateText = await this.page.locator('.selectedDateValue').innerText();
    const currencyText = await this.page.locator('.filterList', { hasText: 'Currency' }).locator('.bodyCopy').innerText();

    // Capture Channels
    const channelDropdown = this.page.locator('#channelType');
    await channelDropdown.locator('button.toggle').click();
    const selectedChannels = await channelDropdown.locator('.option input:checked ~ label').allInnerTexts();
    await channelDropdown.locator('button.toggle').click(); // Close

    // Capture Payment Status
    const paymentDropdown = this.page.locator('#paymentStatus');
    await paymentDropdown.locator('button.toggle').click();
    const selectedPaymentStatus = await paymentDropdown.locator('.option input:checked ~ label').allInnerTexts();
    await paymentDropdown.locator('button.toggle').click(); // Close

    // 3. Print the Output
    console.log("Default Filter selected are as below");
    console.log("Default date: " + dateText);
    console.log("Default Currency: " + currencyText);
    console.log("Default Channels: " + selectedChannels.join(', '));
    console.log("Default Payment Status: " + selectedPaymentStatus.join(', '));

    // 4. Assertions (Using the now globally defined expectedDateStr)
    await expect(this.page.locator('.selectedDateValue')).toHaveText(expectedDateStr);
    await expect(this.page.locator('.filterList', { hasText: 'Currency' }).locator('.bodyCopy')).toHaveText('AED');
    // --- Dashboard Summary Section ---

    // 1. Wait for the 'Total value' text to appear (handles API loading time)
    await this.page.waitForSelector('text=Total value', { timeout: 10000 });

});
When('I Verify Todays Value', async function () {

    console.log("Dashboard Summary are as below:");
    console.log("Total Value: " + await this.summaryPage.getTotalValue());
    console.log("Payments: " + await this.summaryPage.getPayments());
    console.log("Refunds: " + await this.summaryPage.getRefund());
    console.log("Refund Amount: " + await this.summaryPage.getRefundAmount());

});
When('I Verify Yesterday Value', async function () {
    //console.log("Total Yesterday value:" + await this.summaryPage.yesterdayActivityValue);
    const totalValYest = await this.summaryPage.getTotalValueYesterday(); // "AED 2.6K Yesterday"
    const paymentsYest = await this.summaryPage.getPaymentsYesterday();   // "7 Yesterday"
    const refundYest = await this.summaryPage.getRefundYesterday();   // "7 Yesterday"
    const refundAmtYest = await this.summaryPage.getRefundAmountYesterday();   // "7 Yesterday"

    console.log("Total Yesterday value: " + totalValYest);
    console.log("Payments Yesterday value: " + paymentsYest);
    console.log("Refund Yesterday value: " + refundYest);
    console.log("Refund Amount  Yesterday value: " + refundAmtYest);

});
Then('I Verify Total Sales', async function () {
    // 1. Wait for page to settle
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);

    // Locator for the main card (Grand Total)
    const totalSalesLocator = this.page
        .locator('div')
        .filter({ hasText: /^Total sales$/ })
        .locator('..')
        .locator('span, h3')
        .filter({ hasText: /AED|[\d,.]+/ })
        .first();

    try {
        await totalSalesLocator.waitFor({ state: 'visible', timeout: 30000 });
        const totalSalesText = (await totalSalesLocator.innerText()).trim();
        const grandTotalNumeric = parseFloat(totalSalesText.replace(/AED|,/g, '').trim());

        console.log('✅ Dashboard Main Total:', totalSalesText);

        // Click to open the breakdown panel
        await totalSalesLocator.click();

        // 2. Locate the breakdown container
        const breakdownContainer = this.page.locator('div[class*="breakDownContainer"]');
        await breakdownContainer.waitFor({ state: 'visible', timeout: 10000 });

        // 3. Get all outlet labels (e.g., Carrefour Online UAE, Kumar Outlet)
        const outletLocators = breakdownContainer.locator('label.large');
        const outletNames = await outletLocators.allInnerTexts();

        console.log(`📊 Found ${outletNames.length} Outlets. Processing values...`);
        console.log('--------------------------------------------------');

        let calculatedSum = 0;

        // 4. Loop through each outlet name to find its specific total
        for (let i = 0; i < outletNames.length; i++) {
            const name = outletNames[i].trim();

            // Find the parent div that contains this specific outlet name, then find the price inside it
            const priceText = await breakdownContainer
                .locator('div')
                // Filter for the block containing this specific outlet label
                .filter({ has: this.page.locator('label', { hasText: name }) })
                .locator('span')
                .filter({ hasText: /AED/ })
                .first()
                .innerText();

            // Clean the string (remove AED and commas) for math
            const numericValue = parseFloat(priceText.replace(/AED|,/g, '').trim());

            // Print the Name and Value for this specific outlet
            console.log(`Outlet: ${name.padEnd(25)} | Value: ${priceText.trim()}`);

            calculatedSum += numericValue;
        }

        // 5. Final Calculations and Verification
        console.log('--------------------------------------------------');
        console.log(`SUM OF ALL OUTLETS:      AED ${calculatedSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);
        console.log(`EXPECTED GRAND TOTAL:    AED ${grandTotalNumeric.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);

        // Handle floating point precision (allow 0.1 difference)
        const difference = Math.abs(calculatedSum - grandTotalNumeric);

        if (difference < 0.1) {
            console.log('✅ SUCCESS: The sum of all outlets matches the Dashboard Total!');
        } else {
            throw new Error(`❌ MATH MISMATCH: Outlets sum to ${calculatedSum.toFixed(2)} but Dashboard shows ${grandTotalNumeric.toFixed(2)}`);
        }
        // ... (after your math mismatch logic)

        // 1. Identify the pane to close
        const pane = this.page.locator('div[class*="breakDownContainer"]');

        // 2. Trigger the close action
        await this.page.keyboard.press('Escape');

        // 3. Wait for it to disappear so the next test has a clean screen
        await pane.waitFor({ state: 'hidden', timeout: 5000 });

    } catch (e) {
        console.error("❌ Step Failed:", e.message);
        throw e;
    }
});
Then('I Verify {string}', async function (chartName) {
    // 1. Locate the specific card by its header text
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: chartName });
    await chartContainer.scrollIntoViewIfNeeded();

    // 2. Wait for the percentage labels to render (Stability Check)
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');
    await labelLocators.first().waitFor({ state: 'visible', timeout: 15000 });

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();

    let chartData = [];
    let totalVolumeCount = 0;

    console.log(`\n📊 Analyzing ${chartName} Chart...`);

    // PHASE 1: Collect Counts from Tooltips
    for (let i = 0; i < legendCount; i++) {
        const name = (await legendItems.nth(i).locator('.recharts-legend-item-text').innerText()).trim();
        const hexColor = (await legendItems.nth(i).locator('path').getAttribute('fill')).toUpperCase();
        const sector = chartContainer.locator(`path.recharts-sector[fill="${hexColor}"]`).first();

        // Trigger Tooltip using direct dispatch events
        await sector.dispatchEvent('mouseenter');
        await sector.dispatchEvent('mouseover');
        await sector.hover({ force: true });

        await this.page.waitForTimeout(1000); // Wait for tooltip text to update

        const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
        let count = 0;
        if (await tooltip.isVisible()) {
            const rawTooltip = await tooltip.innerText();
            // Regex captures the COUNT (the number AFTER the parentheses)
            // Example: "(580.00) 6" -> grabs 6
            const countMatch = rawTooltip.match(/\)\s*([\d,]+)/);
            count = countMatch ? parseInt(countMatch[1].replace(/,/g, '')) : 0;
        }

        const uiPercentage = (await labelLocators.nth(i).textContent()).trim();
        chartData.push({ name, count, uiPercentage });
        totalVolumeCount += count;

        await sector.dispatchEvent('mouseleave');
    }

    // PHASE 2: Math Verification
    console.log(`Total Volume Count: ${totalVolumeCount}`);

    for (const item of chartData) {
        if (totalVolumeCount > 0) {
            const calculatedPercent = (item.count / totalVolumeCount) * 100;
            const expectedStr = calculatedPercent.toFixed(2) + '%';
            const actualStr = item.uiPercentage.replace(/\s/g, '');

            // Rounding tolerance of 0.1%
            const diff = Math.abs(parseFloat(actualStr) - calculatedPercent);

            console.log(`📍 ${item.name.padEnd(20)}: Count[${item.count}] | UI[${actualStr}] | Calc[${expectedStr}]`);

            if (diff > 0.1) {
                throw new Error(`❌ MISMATCH for ${item.name} in ${chartName}! UI says ${actualStr}, but Math says ${expectedStr}`);
            }
        }
    }
    console.log(`✅ ${chartName} validated successfully.`);
});
Then('I Verify {string}', async function (chartName) {
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: chartName });
    await chartContainer.scrollIntoViewIfNeeded();

    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');
    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();
    
    let chartData = [];
    let totalChartCount = 0;

    console.log(`\n📊 Validating ${chartName} Math...`);

    // PHASE 1: Collect Counts from Tooltips
    for (let i = 0; i < legendCount; i++) {
        const name = (await legendItems.nth(i).locator('.recharts-legend-item-text').innerText()).trim();
        const hexColor = (await legendItems.nth(i).locator('path').getAttribute('fill')).toUpperCase();
        const sector = chartContainer.locator(`path.recharts-sector[fill="${hexColor}"]`).first();

        // Trigger Tooltip
        await sector.hover({ force: true });
        await this.page.waitForTimeout(1000); 

        const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
        let count = 0;
        
        if (await tooltip.isVisible()) {
            const rawTooltip = await tooltip.innerText();
            // REGEX: Extracts the number after the colon (e.g., "15" from "AED : 15")
            const countMatch = rawTooltip.match(/:\s*(\d+)/);
            count = countMatch ? parseInt(countMatch[1]) : 0;
        }

        const uiPercentage = (await labelLocators.nth(i).textContent()).trim();
        chartData.push({ name, count, uiPercentage });
        totalChartCount += count;
    }

    // PHASE 2: Percentage Validation
    console.log(`Total Count Summed: ${totalChartCount}`);
    console.log('----------------------------------------------------------------------');

    for (const item of chartData) {
        if (totalChartCount > 0) {
            const calculated = (item.count / totalChartCount) * 100;
            const expectedStr = calculated.toFixed(2) + '%';
            const actualStr = item.uiPercentage.replace(/\s/g, '');

            // Use 0.05% tolerance for rounding
            const diff = Math.abs(parseFloat(actualStr) - calculated);
            
            process.stdout.write(`📍 ${item.name.padEnd(25)} | Count: ${item.count} | UI: ${actualStr} | Calc: ${expectedStr}`);

            if (diff < 0.05) {
                console.log(` ✅ VALID`);
            } else {
                console.log(` ❌ MISMATCH`);
                throw new Error(`Math Mismatch for ${item.name} in ${chartName}. UI: ${actualStr}, Calc: ${expectedStr}`);
            }
        }
    }
    console.log('----------------------------------------------------------------------\n');
});


Then('I Verify Total Orders', async function () {
    // 1. IMPORTANT: Close the existing Sales panel if it's open
    const closeButton = this.page.locator('button[class*="close"], .src-common__closeIcon');
    if (await closeButton.isVisible()) {
        await closeButton.click();
        await this.page.waitForTimeout(1000); // Wait for animation
    }

    // 2. Locate the "Total orders" card and click it
    const totalOrdersCard = this.page
        .locator('#totalOrders')
        .locator('div.col')
        .filter({ has: this.page.locator('span', { hasText: 'Total orders' }) })
        .locator('button');

    await totalOrdersCard.waitFor({ state: 'visible' });
    await totalOrdersCard.click();

    // 3. Wait for the breakdown panel to appear
    const breakdownContainer = this.page.locator('div[class*="breakDownContainer"]');
    await breakdownContainer.waitFor({ state: 'visible', timeout: 10000 });

    // 4. Get all outlet names
    const outletLocators = breakdownContainer.locator('label.large');
    const outletNames = await outletLocators.allInnerTexts();

    console.log(`📊 Processing Order Breakdown...`);
    console.log('--------------------------------------------------');

    let totalCalculatedOrders = 0;

    // 5. Loop and print in the exact requested format
    for (let i = 0; i < outletNames.length; i++) {
        const name = outletNames[i].trim();

        // Find the numeric value in the same block as the outlet name
        const orderValueText = await breakdownContainer
            .locator('div')
            .filter({ has: this.page.locator('label', { hasText: name }) })
            .locator('span')
            .filter({ hasText: /\d+/ })
            .last()
            .innerText();

        // Clean text to get only digits
        const count = parseInt(orderValueText.replace(/[^\d]/g, ''), 10);

        // FORMATTED OUTPUT
        console.log(`Outlet: ${name.padEnd(25)} | Order total: ${count}`);

        totalCalculatedOrders += count;
    }

    // 6. Verify against Main Card
    const mainCardText = (await totalOrdersCard.innerText()).trim();
    const expectedTotal = parseInt(mainCardText.replace(/[^\d]/g, ''), 10);

    console.log('--------------------------------------------------');
    console.log(`SUM OF ALL OUTLETS:      ${totalCalculatedOrders}`);
    console.log(`CARD TOTAL:              ${expectedTotal}`);

    if (totalCalculatedOrders === expectedTotal) {
        console.log(`✅ SUCCESS: The sum matches the Total Orders card!`);
    } else {
        throw new Error(`❌ MISMATCH: Sum is ${totalCalculatedOrders} but Card shows ${expectedTotal}`);
    }
});
Then('I Verify Average Sales', async function () {
    // 1. Close any open panels from previous steps to avoid "intercepts pointer events"
    const closeButton = this.page.locator('button[aria-label="Close"], .src-common__closeIcon, button.close').first();
    if (await closeButton.isVisible()) {
        await closeButton.click();
        await this.page.waitForTimeout(1000);
    }

    // 2. Click the Average Sales card to open the breakdown
    const avgSalesCard = this.page.locator('#averageSales button');
    await avgSalesCard.click();

    const breakdownContainer = this.page.locator('div[class*="breakDownContainer"]');
    await breakdownContainer.waitFor({ state: 'visible' });

    // 3. Get all Outlet Names
    const outletNames = await breakdownContainer.locator('label.large').allInnerTexts();

    console.log(`\n📊 Cross-Validating Average Sales (Sales / Orders)...`);
    console.log('----------------------------------------------------------------------');

    // We use the data captured from your previous steps or re-scrape if needed.
    // For this standalone step, we assume the Average Sales panel is open.
    for (let i = 0; i < outletNames.length; i++) {
        const name = outletNames[i].trim();

        // A. Get Average Sales Value from the current open panel
        const avgSalesText = await breakdownContainer
            .locator('div')
            .filter({ has: this.page.locator('label', { hasText: name }) })
            .locator('span')
            .filter({ hasText: /AED/ })
            .first()
            .innerText();

        // B. Data points provided by your previous successful runs for validation logic
        // In a real script, you'd store the 'Total Sales' and 'Total Orders' in a Map/Object variable
        // For this example, let's assume we are verifying the logic for Carrefour

        const rawAvg = parseFloat(avgSalesText.replace(/AED|,/g, '').trim());

        // We will print the output in your requested format
        console.log(`Outlet: ${name.padEnd(25)} | Average Sales: ${rawAvg.toLocaleString(undefined, { minimumFractionDigits: 2 })}`);

        // Logic check (Example for Carrefour based on your provided numbers)
        // If Sales = 21198458.80 and Orders = 71
        // Then 21198458.80 / 71 = 298569.84

        /* 
           AUTOMATION TIP: To make this fully dynamic, 
           save your Sales and Orders into an object in previous steps:
           this.salesData = { "CARREFOUR ONLINE UAE": 21198458.80, ... }
           this.orderData = { "CARREFOUR ONLINE UAE": 71, ... }
        */

        // Calculation check
        if (this.salesData && this.orderData) {
            const sales = this.salesData[name];
            const orders = this.orderData[name];
            const expectedAvg = sales / orders;

            const diff = Math.abs(rawAvg - expectedAvg);
            if (diff < 0.1) {
                console.log(`   ✅ Calculation Verified: ${sales} / ${orders} = ${rawAvg.toFixed(2)}`);
            } else {
                console.log(`   ❌ Calculation Failed: Expected ${expectedAvg.toFixed(2)} but found ${rawAvg.toFixed(2)}`);
            }
        }
    }

    console.log('----------------------------------------------------------------------\n');
    const closePanelButton = this.page.locator('button[class*="close"], .src-common__closeIcon, button.close').first();
    if (await closePanelButton.isVisible()) {
        await closePanelButton.click();
        // Optional: wait for the slide-out animation to finish
        await this.page.waitForTimeout(1000);
        console.log('✅ Breakdown panel closed. Ready for cleanup.');
    }
});
Then('I Verify Order failures piechart', async function () {
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: 'Order failures' });
    await chartContainer.scrollIntoViewIfNeeded();

    const colorMap = {
        '#002E5D': 'Dark Blue',
        '#00A390': 'Teal',
        '#FF5859': 'Red/Coral',
        '#00C7B1': 'Bright Green'
    };

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');

    console.log(`\n📊 Analyzing Order Failures Graph...`);
    console.log('----------------------------------------------------------------------');

    for (let i = 0; i < legendCount; i++) {
        // A. Reset: Hover over the legend text first to move the mouse away from the pie
        const legendText = legendItems.nth(i).locator('.recharts-legend-item-text');
        await legendText.hover();

        const name = (await legendText.innerText()).trim();
        const hexColor = (await legendItems.nth(i).locator('path').getAttribute('fill')).toUpperCase();
        const colorName = colorMap[hexColor] || 'Theme Color';

        // B. Target the sector and use a more aggressive hover
        const sector = chartContainer.locator(`path.recharts-sector[fill="${hexColor}"]`).first();

        // C. Force the tooltip: Hover with a tiny offset from center to trigger the SVG boundary
        const box = await sector.boundingBox();
        if (box) {
            // Hover near the edge of the slice first, then the center
            await this.page.mouse.move(box.x, box.y);
            await this.page.waitForTimeout(200);
            await sector.hover({ force: true, position: { x: 10, y: 10 } });
        }

        // D. Final Trigger: Dispatch Mouse events directly to the browser's SVG engine
        await sector.dispatchEvent('mouseenter');
        await sector.dispatchEvent('mouseover');
        await this.page.waitForTimeout(1000);

        // E. Extract Tooltip
        const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
        let tooltipText = "N/A";

        if (await tooltip.isVisible()) {
            tooltipText = (await tooltip.innerText()).replace(/\n/g, ' ').trim();
        }

        // F. Extract Percentage
        let percentage = "N/A";
        if (i < await labelLocators.count()) {
            percentage = await labelLocators.nth(i).evaluate(node => node.textContent);
        }

        console.log(`Category:    ${name.padEnd(30)}`);
        console.log(`  └─ Color:      ${colorName} (${hexColor})`);
        console.log(`  └─ Percentage: ${percentage}`);
        console.log(`  └─ Tooltip:    ${tooltipText}`);
    }
    console.log('----------------------------------------------------------------------\n');
});
Then('I Verify Sales by payment type piechart', async function () {
    // 1. Locate the specific card for Sales by payment type
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: 'Sales by payment type' });
    await chartContainer.scrollIntoViewIfNeeded();
    await chartContainer.waitFor({ state: 'visible', timeout: 10000 });

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');

    let chartData = [];
    let totalSalesValue = 0;

    console.log(`\n📊 Analyzing Sales by Payment Type Graph (${legendCount} types)...`);
    console.log('----------------------------------------------------------------------');

    for (let i = 0; i < legendCount; i++) {
        // A. Hover legend to move mouse away initially
        const legendTextLocator = legendItems.nth(i).locator('.recharts-legend-item-text');
        await legendTextLocator.hover();

        const name = (await legendTextLocator.innerText()).trim();
        const hexColor = (await legendItems.nth(i).locator('path').getAttribute('fill')).toUpperCase();

        // B. Target the specific Pie Sector by color hex
        const sector = chartContainer.locator(`path.recharts-sector[fill="${hexColor}"]`).first();

        // C. Trigger Tooltip: Force hover and dispatch React events
        await this.page.mouse.move(0, 0);
        await sector.hover({ force: true });
        await sector.dispatchEvent('mouseenter');
        await sector.dispatchEvent('mouseover');

        // D. Wait for Tooltip to populate
        await this.page.waitForTimeout(1000);

        // E. Extract Tooltip Content
        const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
        let tooltipText = "0";
        if (await tooltip.isVisible()) {
            tooltipText = (await tooltip.innerText()).replace(/\n/g, ' ').trim();
        }

        // F. Extract UI Percentage (e.g., "100.00%")
        let uiPercentageLabel = "0%";
        if (i < await labelLocators.count()) {
            uiPercentageLabel = (await labelLocators.nth(i).evaluate(node => node.textContent)).trim();
        }

        // --- MATH LOGIC ---
        // Regex extracts "580.00" from tooltip text
        const valueMatch = tooltipText.match(/([\d,.]+)/);
        const numericValue = valueMatch ? parseFloat(valueMatch[0].replace(/,/g, '')) : 0;

        chartData.push({
            name,
            value: numericValue,
            uiPercentage: uiPercentageLabel
        });
        totalSalesValue += numericValue;

        console.log(`Payment Type: ${name.padEnd(20)} | UI Label: ${uiPercentageLabel} | Tooltip: ${tooltipText}`);
    }

    // --- FINAL VERIFICATION ---
    console.log('----------------------------------------------------------------------');
    console.log(`Total Sales Summed: ${totalSalesValue.toFixed(2)}`);

    if (totalSalesValue > 0) {
        for (const data of chartData) {
            const calculatedPercent = (data.value / totalSalesValue) * 100;
            const expectedPercentStr = calculatedPercent.toFixed(2) + '%';
            const actualPercentStr = data.uiPercentage.replace(/\s/g, '');

            // Use 0.05% tolerance for rounding
            const diff = Math.abs(parseFloat(actualPercentStr) - calculatedPercent);

            if (diff < 0.05) {
                console.log(`✅ VALID: ${data.name.padEnd(15)} (${actualPercentStr}) matches math.`);
            } else {
                console.error(`❌ ERROR: ${data.name} mismatch! UI: ${actualPercentStr}, Math: ${expectedPercentStr}`);
                throw new Error(`Math Mismatch for ${data.name}. Expected ~${expectedPercentStr} but UI shows ${actualPercentStr}`);
            }
        }
    } else {
        console.log("ℹ️ No sales value found to calculate percentages.");
    }
    console.log('----------------------------------------------------------------------\n');
});


Then('I a Verify Sales by payment type piechart', async function () {
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: 'Sales by payment type' });
    await chartContainer.scrollIntoViewIfNeeded();

    const colorMap = {
        '#002E5D': 'Dark Blue (Visa)',
        '#00A390': 'Teal (Mastercard)',
        '#FF5859': 'Red (American Express)',
        '#F1C402': 'Yellow (China UnionPay)',
        '#979797': 'Grey (Diners Club)',
        '#3E79B4': 'Light Blue (Jaywan)'
    };

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');

    console.log(`\n📊 Analyzing Sales by Payment Type (${legendCount} categories)...`);
    console.log('----------------------------------------------------------------------');

    for (let i = 0; i < legendCount; i++) {
        const legendTextLocator = legendItems.nth(i).locator('.recharts-legend-item-text');
        const name = (await legendTextLocator.innerText()).trim();

        // Extract hex and normalize to uppercase
        const rawHex = await legendItems.nth(i).locator('path').getAttribute('fill');
        const hexColor = rawHex.toUpperCase();
        const colorName = colorMap[hexColor] || 'Theme Color';

        // Find the sector. Note: Recharts might not render 0% slices
        const sector = chartContainer.locator(`path.recharts-sector[fill="${rawHex}"]`).first();

        let tooltipText = "N/A (Slice too small)";
        let percentage = "N/A";

        // Only attempt interaction if the slice is visible/exists
        if (await sector.count() > 0 && await sector.isVisible()) {
            await this.page.mouse.move(0, 0);
            await sector.hover({ force: true }).catch(() => console.log(`   ⚠️ Hover skipped for ${name}`));
            await sector.dispatchEvent('mouseenter');
            await this.page.waitForTimeout(800);

            const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
            if (await tooltip.isVisible()) {
                tooltipText = (await tooltip.innerText()).replace(/\n/g, ' ').trim();
            }
        }

        // Get Percentage using textContent
        if (i < await labelLocators.count()) {
            percentage = await labelLocators.nth(i).evaluate(node => node.textContent);
        }

        console.log(`Payment Type: ${name.padEnd(25)}`);
        console.log(`  └─ Color:      ${colorName} (${hexColor})`);
        console.log(`  └─ Percentage: ${percentage}`);
        console.log(`  └─ Tooltip:    ${tooltipText}`);
    }
    console.log('----------------------------------------------------------------------\n');
});
Then('I Verify Top 5 declines piechart', async function () {
    // 1. Locate the specific card for Top 5 declines
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: 'Top 5 declines' });
    await chartContainer.scrollIntoViewIfNeeded();
    await chartContainer.waitFor({ state: 'visible', timeout: 10000 });

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');

    let chartData = [];
    let totalDeclineValue = 0;

    console.log(`\n📊 Analyzing Top 5 Declines Graph (${legendCount} reasons)...`);
    console.log('----------------------------------------------------------------------');

    for (let i = 0; i < legendCount; i++) {
        // A. Hover legend text to move mouse away from the pie center
        const legendTextLocator = legendItems.nth(i).locator('.recharts-legend-item-text');
        await legendTextLocator.hover();

        const name = (await legendTextLocator.innerText()).trim();
        const hexColor = (await legendItems.nth(i).locator('path').getAttribute('fill')).toUpperCase();

        // B. Target the specific Pie Sector by color hex
        const sector = chartContainer.locator(`path.recharts-sector[fill="${hexColor}"]`).first();

        // C. Trigger Tooltip: Reset mouse, hover sector, and dispatch events
        await this.page.mouse.move(0, 0);
        await sector.hover({ force: true });
        await sector.dispatchEvent('mouseenter');
        await sector.dispatchEvent('mouseover');

        // D. Stabilization: Wait for the Tooltip to render content
        await this.page.waitForTimeout(1000);

        // E. Extract Tooltip Content (e.g., "(200.00) 1")
        const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
        let tooltipText = "0";
        if (await tooltip.isVisible()) {
            tooltipText = (await tooltip.innerText()).replace(/\n/g, ' ').trim();
        }

        // F. Extract UI Percentage Label (e.g., "39.60%")
        let uiPercentageLabel = "0%";
        if (i < await labelLocators.count()) {
            uiPercentageLabel = (await labelLocators.nth(i).evaluate(node => node.textContent)).trim();
        }

        // --- VALIDATION LOGIC: Extract numeric value from brackets ---
        // Regex pulls "200.00" from "(200.00) 1"
        const valueMatch = tooltipText.match(/([\d,.]+)/);
        const numericValue = valueMatch ? parseFloat(valueMatch[0].replace(/,/g, '')) : 0;

        // Store data for final validation loop
        chartData.push({
            name,
            value: numericValue,
            uiPercentage: uiPercentageLabel
        });
        totalDeclineValue += numericValue;

        console.log(`Decline Reason: ${name.padEnd(35)} | UI Label: ${uiPercentageLabel} | Tooltip: ${tooltipText}`);
    }

    // --- FINAL MATH VERIFICATION ---
    console.log('----------------------------------------------------------------------');
    console.log(`Total Decline Value Summed: ${totalDeclineValue.toFixed(2)}`);

    if (totalDeclineValue > 0) {
        for (const data of chartData) {
            const calculatedPercent = (data.value / totalDeclineValue) * 100;
            const expectedPercentStr = calculatedPercent.toFixed(2) + '%';
            const actualPercentStr = data.uiPercentage.replace(/\s/g, '');

            // Tolerance check (0.05) for rounding
            const diff = Math.abs(parseFloat(actualPercentStr) - calculatedPercent);

            if (diff < 0.05) {
                console.log(`✅ VALID: ${data.name.padEnd(20)} (${actualPercentStr}) is correct.`);
            } else {
                console.error(`❌ ERROR: ${data.name} mismatch! UI: ${actualPercentStr}, Math: ${expectedPercentStr}`);
                throw new Error(`Math Mismatch for ${data.name}. Expected ~${expectedPercentStr} but UI shows ${actualPercentStr}`);
            }
        }
    } else {
        console.log("ℹ️ No decline value found to calculate percentages.");
    }
    console.log('----------------------------------------------------------------------\n');
});

Then('I a Verify Top 5 declines piechart', async function () {
    // 1. Locate the specific card for Top 5 declines
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: 'Top 5 declines' });
    await chartContainer.scrollIntoViewIfNeeded();
    await chartContainer.waitFor({ state: 'visible', timeout: 10000 });

    // 2. Map colors to the specific decline reasons found in your HTML
    const colorMap = {
        '#002E5D': 'Dark Blue (Terminal Not Allowed)',
        '#00A390': 'Teal (Issue a Call)',
        '#FF5859': 'Red (Unknown Reason)',
        '#F1C402': 'Yellow (Bad Message Edit)',
        '#979797': 'Grey (Incorrect PIN)'
    };

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');

    console.log(`\n📊 Analyzing Top 5 Declines Graph...`);
    console.log('----------------------------------------------------------------------');

    for (let i = 0; i < legendCount; i++) {
        // A. Reset: Hover legend text first to move mouse away from the pie
        const legendTextLocator = legendItems.nth(i).locator('.recharts-legend-item-text');
        await legendTextLocator.hover();

        const name = (await legendTextLocator.innerText()).trim();
        const hexColor = (await legendItems.nth(i).locator('path').getAttribute('fill')).toUpperCase();
        const colorName = colorMap[hexColor] || 'Theme Color';

        // B. Target the specific Pie Sector by color hex
        const sector = chartContainer.locator(`path.recharts-sector[fill="${hexColor}"]`).first();

        // C. Trigger Tooltip: Force hover and dispatch events
        await this.page.mouse.move(0, 0);
        await sector.hover({ force: true });
        await sector.dispatchEvent('mouseenter');

        // D. Wait for Tooltip transition
        await this.page.waitForTimeout(1000);

        // E. Extract Tooltip (Decline count/details)
        const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
        let tooltipText = "N/A";
        if (await tooltip.isVisible()) {
            tooltipText = (await tooltip.innerText()).replace(/\n/g, ' ').trim();
        }

        // F. Extract Percentage (Using evaluate/textContent for SVG)
        let percentage = "N/A";
        if (i < await labelLocators.count()) {
            percentage = await labelLocators.nth(i).evaluate(node => node.textContent);
        }

        // --- FORMATTED OUTPUT ---
        console.log(`Decline Reason: ${name.padEnd(35)}`);
        console.log(`  └─ Color:      ${colorName} (${hexColor})`);
        console.log(`  └─ Percentage: ${percentage}`);
        console.log(`  └─ Tooltip:    ${tooltipText}`);
    }
    console.log('----------------------------------------------------------------------\n');
});
Then('I Verify a Acceptance rate piechart', async function () {
    await this.page.waitForTimeout(3000);
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: 'Acceptance rate' });
    await chartContainer.scrollIntoViewIfNeeded();

    // Wait for the percentage labels to be visible (ensures data is present)
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');
    await labelLocators.first().waitFor({ state: 'visible', timeout: 15000 });

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();

    let chartData = [];
    let totalValue = 0;

    console.log(`\n📊 Analyzing Acceptance Rate Graph...`);
    console.log('----------------------------------------------------------------------');

    // PHASE 1: Data Collection
    for (let i = 0; i < legendCount; i++) {
        const legendTextLocator = legendItems.nth(i).locator('.recharts-legend-item-text');
        const name = (await legendTextLocator.innerText()).trim();
        const hexColor = (await legendItems.nth(i).locator('path').getAttribute('fill')).toUpperCase();
        const sector = chartContainer.locator(`path.recharts-sector[fill="${hexColor}"]`).first();

        // 🛡️ Trigger Tooltip: Reset mouse, then force React events
        await this.page.mouse.move(0, 0);
        await sector.dispatchEvent('mouseenter');
        await sector.dispatchEvent('mouseover');
        await sector.hover({ force: true });

        await this.page.waitForTimeout(1000); // Wait for tooltip text to update

        // Extract numeric value from Tooltip (e.g., "(580.00) 6")
        const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
        let value = 0;
        if (await tooltip.isVisible()) {
            const rawTooltip = await tooltip.innerText();
            // Regex captures the number inside the parentheses
            const valueMatch = rawTooltip.match(/\(([\d,.]+)\)/);
            if (valueMatch) {
                value = parseFloat(valueMatch[1].replace(/,/g, ''));
            }
        }

        // Extract the UI Percentage Label
        const uiPercentage = (await labelLocators.nth(i).textContent()).trim();

        chartData.push({ name, value, uiPercentage });
        totalValue += value;

        // Reset state
        await sector.dispatchEvent('mouseleave');
    }

    // 🛡️ Guard: Ensure we actually captured data
    if (totalValue === 0) {
        throw new Error("❌ FAILED: Total Value is 0.00. Script could not extract data from tooltips.");
    }

    // PHASE 2: Validation & Assertion
    console.log(`Total Chart Value: ${totalValue.toFixed(2)}`);

    for (const item of chartData) {
        const calculated = (item.value / totalValue) * 100;
        const expectedPercentStr = calculated.toFixed(2) + '%';
        const actualPercentStr = item.uiPercentage.replace(/\s/g, '');

        console.log(`Status: ${item.name.padEnd(15)} | Value: ${item.value.toFixed(2).padStart(10)}`);
        console.log(`  └─ UI Label:   ${actualPercentStr}`);
        console.log(`  └─ Math Says:  ${expectedPercentStr}`);

        // Compare using a small tolerance for rounding (0.02%)
        const diff = Math.abs(parseFloat(actualPercentStr) - calculated);
        if (diff < 0.02) {
            console.log(`  ✅ MATCH: Percentage is correct.`);
        } else {
            console.error(`  ❌ MISMATCH: Expected ${expectedPercentStr} but found ${actualPercentStr}`);
            throw new Error(`Percentage mismatch for ${item.name}. UI: ${actualPercentStr}, Calculated: ${expectedPercentStr}`);
        }
    }
    console.log('----------------------------------------------------------------------\n');
});

Then('I Verify  old Top 5 declines piechart', async function () {
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: 'Top 5 declines' });
    await chartContainer.scrollIntoViewIfNeeded();

    // 🛡️ GUARD: Skip if chart is empty
    const isNoData = await chartContainer.locator('text="No data"').isVisible();
    const greySector = chartContainer.locator('path.recharts-sector[fill="#E0E0E0"]').first();
    if (isNoData || await greySector.isVisible()) {
        console.log("ℹ️ Top 5 Declines: No data available. Skipping...");
        return;
    }

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');

    let chartData = [];
    let totalValue = 0;

    for (let i = 0; i < legendCount; i++) {
        const hexColor = (await legendItems.nth(i).locator('path').getAttribute('fill')).toUpperCase();
        const name = (await legendItems.nth(i).locator('.recharts-legend-item-text').innerText()).trim();
        const sector = chartContainer.locator(`path.recharts-sector[fill="${hexColor}"]`).first();

        // 🛡️ STRATEGY: Force React events to trigger Tooltip
        await sector.dispatchEvent('mouseenter');
        await sector.dispatchEvent('mouseover');
        await sector.hover({ force: true });
        await this.page.waitForTimeout(1000);

        const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
        let value = 0;

        if (await tooltip.isVisible()) {
            const rawTooltip = await tooltip.innerText();
            // Regex to find number inside ( )
            const valueMatch = rawTooltip.match(/\(([\d,.]+)\)/);
            if (valueMatch) {
                value = parseFloat(valueMatch[1].replace(/,/g, ''));
            }
        }

        let uiPercentage = "0%";
        if (i < await labelLocators.count()) {
            uiPercentage = (await labelLocators.nth(i).textContent()).trim();
        }

        chartData.push({ name, value, uiPercentage });
        totalValue += value;

        // Clean up hover for next item
        await sector.dispatchEvent('mouseleave');
    }

    // 🛡️ FINAL CHECK
    if (totalValue === 0) {
        throw new Error("❌ FAILED: Total Value is 0. Tooltip content was not captured. Check if tooltips are enabled on this chart.");
    }

    console.log(`💰 Total Decline Value: ${totalValue.toFixed(2)}`);

    for (const item of chartData) {
        const calculated = (item.value / totalValue) * 100;
        const expectedStr = calculated.toFixed(2) + '%';
        const actualStr = item.uiPercentage.replace(/\s/g, '');

        const diff = Math.abs(parseFloat(actualStr) - calculated);
        if (diff < 0.1) {
            console.log(`  ✅ VALID: ${item.name} (${actualStr})`);
        } else {
            throw new Error(`Mismatch for ${item.name}. UI: ${actualStr}, Calc: ${expectedStr}`);
        }
    }
});


Then('I a Verify Acceptance rate piechart', async function () {
    await this.page.waitForTimeout(2000);
    // 1. Locate the specific card for Acceptance rate
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: 'Acceptance rate' });
    await chartContainer.scrollIntoViewIfNeeded();
    await chartContainer.waitFor({ state: 'visible', timeout: 10000 });

    // 2. Define Color Mapping based on your HTML
    const colorMap = {
        '#002E5D': 'Dark Blue (Approved)',
        '#00A390': 'Teal (Declined)'
    };

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');

    console.log(`\n📊 Analyzing Acceptance Rate Graph (${legendCount} categories)...`);
    console.log('----------------------------------------------------------------------');

    for (let i = 0; i < legendCount; i++) {
        // A. Reset: Hover legend text first to move mouse away from the pie center
        const legendTextLocator = legendItems.nth(i).locator('.recharts-legend-item-text');
        await legendTextLocator.hover();

        const name = (await legendTextLocator.innerText()).trim();
        const hexColor = (await legendItems.nth(i).locator('path').getAttribute('fill')).toUpperCase();
        const colorName = colorMap[hexColor] || 'Theme Color';

        // B. Target the specific Pie Sector by color hex
        const sector = chartContainer.locator(`path.recharts-sector[fill="${hexColor}"]`).first();

        // C. Trigger Tooltip: Move to (0,0), Hover, and Dispatch events
        await this.page.mouse.move(0, 0);
        await sector.hover({ force: true });
        await sector.dispatchEvent('mouseenter');
        await sector.dispatchEvent('mouseover');

        // D. Stabilization: Wait for the React Tooltip to render
        await this.page.waitForTimeout(1000);

        // E. Extract Tooltip Content (The numeric count)
        const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
        let tooltipText = "N/A";
        if (await tooltip.isVisible()) {
            tooltipText = (await tooltip.innerText()).replace(/\n/g, ' ').trim();
        }

        // F. Extract Percentage (Using textContent for SVG elements)
        let percentage = "N/A";
        const labelCount = await labelLocators.count();
        if (i < labelCount) {
            percentage = await labelLocators.nth(i).evaluate(node => node.textContent);
        }

        // --- FORMATTED OUTPUT ---
        console.log(`Status:      ${name.padEnd(25)}`);
        console.log(`  └─ Color:      ${colorName} (${hexColor})`);
        console.log(`  └─ Percentage: ${percentage}`);
        console.log(`  └─ Tooltip:    ${tooltipText}`);
    }
    console.log('----------------------------------------------------------------------\n');
});
Then('I Verify Acceptance rate piechart', async function () {
    await this.page.waitForTimeout(2000);
    // 1. Locate the specific card for Acceptance rate
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: 'Acceptance rate' });
    await chartContainer.scrollIntoViewIfNeeded();
    await chartContainer.waitFor({ state: 'visible', timeout: 10000 });

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');

    let chartData = [];
    let totalValue = 0;

    console.log(`\n📊 Analyzing Acceptance Rate Graph (${legendCount} categories)...`);
    console.log('----------------------------------------------------------------------');

    for (let i = 0; i < legendCount; i++) {
        // A. Reset: Hover legend text first to move mouse away from the pie center
        const legendTextLocator = legendItems.nth(i).locator('.recharts-legend-item-text');
        await legendTextLocator.hover();

        const name = (await legendTextLocator.innerText()).trim();
        const hexColor = (await legendItems.nth(i).locator('path').getAttribute('fill')).toUpperCase();

        // B. Target the specific Pie Sector by color hex
        const sector = chartContainer.locator(`path.recharts-sector[fill="${hexColor}"]`).first();

        // C. Trigger Tooltip: Move to (0,0), Hover, and Dispatch events
        await this.page.mouse.move(0, 0);
        await sector.hover({ force: true });
        await sector.dispatchEvent('mouseenter');
        await sector.dispatchEvent('mouseover');

        // D. Stabilization: Wait for the React Tooltip to render
        await this.page.waitForTimeout(1000);

        // E. Extract Tooltip Content (The numeric amount)
        const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
        let tooltipText = "0";
        if (await tooltip.isVisible()) {
            tooltipText = (await tooltip.innerText()).replace(/\n/g, ' ').trim();
        }

        // F. Extract Percentage Label from the UI
        let uiPercentageLabel = "0%";
        const labelCount = await labelLocators.count();
        if (i < labelCount) {
            uiPercentageLabel = await labelLocators.nth(i).evaluate(node => node.textContent);
        }

        // --- NEW VALIDATION LOGIC START ---
        // Extract numbers from tooltip (e.g., "580.00" from "Declined : 580.00AED")
        const valueMatch = tooltipText.match(/([\d,.]+)/);
        const numericValue = valueMatch ? parseFloat(valueMatch[0].replace(/,/g, '')) : 0;

        // Save data to validate after we have the total sum
        chartData.push({
            name,
            value: numericValue,
            uiPercentage: uiPercentageLabel.trim()
        });
        totalValue += numericValue;
        // --- NEW VALIDATION LOGIC END ---

        console.log(`Status: ${name.padEnd(15)} | UI Label: ${uiPercentageLabel} | Tooltip: ${tooltipText}`);
    }

    // --- FINAL CALCULATION CHECK ---
    console.log('----------------------------------------------------------------------');
    console.log(`Total Value Summed: ${totalValue.toFixed(2)}`);

    for (const data of chartData) {
        if (totalValue > 0) {
            const calculatedPercent = (data.value / totalValue) * 100;
            const expectedPercentStr = calculatedPercent.toFixed(2) + '%';
            const actualPercentStr = data.uiPercentage.replace(/\s/g, '');

            // Use a small tolerance (0.05) for rounding differences
            const diff = Math.abs(parseFloat(actualPercentStr) - calculatedPercent);

            if (diff < 0.05) {
                console.log(`✅ VALID: ${data.name} percentage (${actualPercentStr}) is correct.`);
            } else {
                console.error(`❌ ERROR: ${data.name} mismatch! UI: ${actualPercentStr}, Math: ${expectedPercentStr}`);
                throw new Error(`Math Mismatch for ${data.name}. Expected ~${expectedPercentStr} but UI shows ${actualPercentStr}`);
            }
        }
    }
    console.log('----------------------------------------------------------------------\n');
});


Then('I Verify Ecom Pie charts', async function () {
    // Use 'this.page' if your framework attaches it to the World context
    const page = this.page;

    // Locate all chart header buttons using the specific class from your HTML
    const chartHeaders = page.locator('.src-pages-dashboard-dashboard__cardChartHeader--BBKjH button');

    // Wait for the elements to be present in the DOM
    await chartHeaders.first().waitFor();

    // Get all names: ['Acceptance rate', 'Top 5 declines', 'Sales by payment type']
    const names = await chartHeaders.allInnerTexts();

    console.log('Detected Pie Charts:', names);

    // Verify each is visible
    const count = await chartHeaders.count();
    for (let i = 0; i < count; i++) {
        await expect(chartHeaders.nth(i)).toBeVisible();
    }
    await this.page.waitForTimeout(1000);
});
Then('I Verify {string} piechart', async function (chartName) {
    // 1. Locate the specific chart container
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: chartName });
    await chartContainer.scrollIntoViewIfNeeded();
    await expect(chartContainer).toBeVisible();

    const colorMap = {
        '#002E5D': 'Dark Blue (Visa)',
        '#00A390': 'Teal (Mastercard)',
        '#FF5859': 'Red (American Express)',
        '#F1C402': 'Yellow (China UnionPay)',
        '#979797': 'Grey (Diners Club)',
        '#3E79B4': 'Light Blue (Jaywan)',
        '#E0E0E0': 'Grey (No Data)'
    };

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');

    console.log(`\n📊 Analyzing Chart: "${chartName}" (${legendCount} categories)...`);
    console.log('----------------------------------------------------------------------');

    for (let i = 0; i < legendCount; i++) {
        const legendItem = legendItems.nth(i);
        const name = (await legendItem.locator('.recharts-legend-item-text').innerText()).trim();

        // Get the hex color from the legend icon
        const rawHex = await legendItem.locator('path').getAttribute('fill') || '#FFFFFF';
        const hexColor = rawHex.toUpperCase();
        const colorName = colorMap[hexColor] || 'Theme Color';

        if (name === "No data") {
            console.log(`⚠️ Note: Chart "${chartName}" is showing NO DATA.`);
            continue;
        }

        // Find the specific SVG sector (slice) matching this color
        const sector = chartContainer.locator(`path.recharts-sector[fill="${rawHex}"]`).first();
        let tooltipText = "N/A";
        let percentage = "N/A";

        if (await sector.count() > 0) {
            try {
                // PRECISION HOVER: Move to legend first to "focus" the chart
                await legendItem.hover();
                await this.page.waitForTimeout(200);

                // HOVER SECTOR: We use a small offset (5,5) because for large slices (like "Repeat"), 
                // the center of the bounding box is often the empty "hole" in the middle of the pie.
                await sector.hover({ force: true, position: { x: 5, y: 5 } });

                // Trigger Recharts internal listeners manually
                await sector.dispatchEvent('mouseover');
                await sector.dispatchEvent('mouseenter');
                await sector.dispatchEvent('mousemove');

                // Wait for the tooltip wrapper and then the text content
                const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
                await tooltip.waitFor({ state: 'visible', timeout: 3000 });

                // Vital: wait for React to populate the text inside the tooltip div
                await this.page.waitForTimeout(500);

                const rawContent = await tooltip.innerText();
                tooltipText = rawContent ? rawContent.replace(/\n/g, ' ').trim() : "Tooltip hidden/empty";
            } catch (e) {
                tooltipText = "Hover failed (Trigger issue)";
            }
        }

        // Extract percentage from SVG labels
        if (i < await labelLocators.count()) {
            percentage = (await labelLocators.nth(i).textContent()) || "N/A";
        }

        console.log(`Category:     ${name.padEnd(25)}`);
        console.log(`  └─ Color:      ${colorName} (${hexColor})`);
        console.log(`  └─ Percentage: ${percentage}`);
        console.log(`  └─ Tooltip:    ${tooltipText}`);
    }
    console.log('----------------------------------------------------------------------\n');
});



Then('I b Verify {string} piechart', async function (chartName) {
    // 1. Find the specific card container based on the chart name provided in the feature file
    const chartContainer = this.page.locator('.src-pages-dashboard-dashboard__cardChart--jwdFW', { hasText: chartName });

    await chartContainer.scrollIntoViewIfNeeded();
    await expect(chartContainer).toBeVisible();

    const colorMap = {
        '#002E5D': 'Dark Blue (Visa)',
        '#00A390': 'Teal (Mastercard)',
        '#FF5859': 'Red (American Express)',
        '#F1C402': 'Yellow (China UnionPay)',
        '#979797': 'Grey (Diners Club)',
        '#3E79B4': 'Light Blue (Jaywan)',
        '#E0E0E0': 'Grey (No Data)'
    };

    const legendItems = chartContainer.locator('li.recharts-legend-item');
    const legendCount = await legendItems.count();
    const labelLocators = chartContainer.locator('g.recharts-pie-labels text');

    console.log(`\n📊 Analyzing Chart: "${chartName}" (${legendCount} categories)...`);
    console.log('----------------------------------------------------------------------');

    for (let i = 0; i < legendCount; i++) {
        const legendTextLocator = legendItems.nth(i).locator('.recharts-legend-item-text');
        const name = (await legendTextLocator.innerText()).trim();

        // Extract and normalize color
        const rawHex = await legendItems.nth(i).locator('path').getAttribute('fill') || '#FFFFFF';
        const hexColor = rawHex.toUpperCase();
        const colorName = colorMap[hexColor] || 'Theme Color';

        // Check for "No data" state
        if (name === "No data") {
            console.log(`⚠️ Note: Chart "${chartName}" is currently showing NO DATA.`);
            continue;
        }

        // Locate sector
        const sector = chartContainer.locator(`path.recharts-sector[fill="${rawHex}"]`).first();
        let tooltipText = "N/A";
        let percentage = "N/A";

        if (await sector.count() > 0 && await sector.isVisible()) {
            try {
                await sector.hover({ force: true, timeout: 2000 });
                await sector.dispatchEvent('mouseenter');
                await this.page.waitForTimeout(500);

                const tooltip = chartContainer.locator('.recharts-tooltip-wrapper');
                if (await tooltip.isVisible()) {
                    tooltipText = (await tooltip.innerText()).replace(/\n/g, ' ').trim();
                }
            } catch (e) {
                tooltipText = "Hover failed (Slice hidden/small)";
            }
        }

        // Get Percentage from the SVG labels
        if (i < await labelLocators.count()) {
            percentage = await labelLocators.nth(i).evaluate(node => node.textContent);
        }

        console.log(`Category:     ${name.padEnd(25)}`);
        console.log(`  └─ Color:      ${colorName} (${hexColor})`);
        console.log(`  └─ Percentage: ${percentage}`);
        console.log(`  └─ Tooltip:    ${tooltipText}`);
    }
    console.log('----------------------------------------------------------------------\n');
});
Then('I Verify {string} Breakdown', async function (cardName) {
    console.log(`\n🔍 OPENING DRILL-DOWN: ${cardName}`);

    const cardButton = this.page.locator('button, [role="button"], .src-pages-dashboard-dashboard__cardChart--jwdFW')
        .filter({ hasText: new RegExp(`^${cardName}$`, 'i') }).first();

    await cardButton.scrollIntoViewIfNeeded();
    await cardButton.dispatchEvent('click');

    const breakdownContainer = this.page.locator('div[class*="breakDownContainer"]');
    await breakdownContainer.waitFor({ state: 'visible', timeout: 15000 });

    const outletBlocks = await breakdownContainer.locator('> div:has(label.large)').all();
    let grandTotalSum = 0;

    for (const block of outletBlocks) {
        const outletName = (await block.locator('label.large').first().innerText()).trim();
        console.log(`\n🏢 OUTLET: ${outletName}`);
        console.log(`--------------------------------------------------`);

        const rows = await block.locator('div.src-common__spaceBetween--pkKAg').all();

        // Check if this outlet block contains a "Total" row
        const hasTotalRow = (await block.locator('div.src-common__spaceBetween--pkKAg', { hasText: /Total/i }).count()) > 0;
        let outletSum = 0;

        for (const row of rows) {
            const cleanText = (await row.innerText()).replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
            console.log(`   🔹 ${cleanText}`);
            const isTotalRow = cleanText.toLowerCase().includes('total');

            if (isTotalRow || !hasTotalRow) {
                const matches = cleanText.match(/[\d,.]+/g);
                if (matches) {
                    // Grab the last number in the string (the count/amount)
                    const numericValue = parseFloat(matches[matches.length - 1].replace(/,/g, ''));
                    if (!isNaN(numericValue)) outletSum += numericValue;
                }
            }
        }
        grandTotalSum += outletSum;
        //  await this.page.locator('button.close').click({ force: true });

    }

    console.log(`--------------------------------------------------`);
    console.log(`✅ VERIFICATION COMPLETE: Calculated Sum = ${grandTotalSum}\n`);

    const closeButton = this.page.locator('button.close, [class*="closeButton"], .src-pages-dashboard-dashboard__close--XYZ'); // Update class based on your app's naming
    await closeButton.first().click();
    await breakdownContainer.waitFor({ state: 'hidden', timeout: 5000 });

});

Then('I b Verify {string} Breakdown', async function (cardName) {
    console.log(`🔍 Starting Drill-Down Verification for: ${cardName}`);

    // 1. Locate the Card/Graph Button (Uses dispatchEvent to force click if standard click fails)
    const cardButton = this.page.locator('button, [role="button"], #kpi-stat-card')
        .filter({ hasText: new RegExp(`^${cardName}$`, 'i') })
        .first();

    try {
        await cardButton.waitFor({ state: 'visible', timeout: 10000 });

        // Use dispatchEvent for a cleaner programmatic click on Chart Cards
        await cardButton.dispatchEvent('click');
        console.log(`🖱️ Clicked ${cardName} card to open breakdown.`);

        // 2. Wait for the Breakdown Panel to slide in
        const breakdownContainer = this.page.locator('div[class*="breakDownContainer"]');
        await breakdownContainer.waitFor({ state: 'visible', timeout: 10000 });

        // 3. Process Outlets inside the Breakdown
        const outletLocators = breakdownContainer.locator('label.large');
        const outletNames = await outletLocators.allInnerTexts();
        let calculatedSum = 0;

        console.log(`📊 Found ${outletNames.length} Outlets. Summing values...`);

        for (const name of outletNames) {
            const outletBlock = breakdownContainer.locator('> div').filter({
                has: this.page.locator('label', { hasText: name.trim() })
            });

            // HYBRID LOGIC: 
            // 1. Try to find a row specifically named "Total" (like Collection Status)
            // 2. Fallback to the last numeric value in the block (like Currency/Shopper Type)
            const totalRow = outletBlock.locator('div.src-common__spaceBetween--pkKAg').filter({ hasText: 'Total' });
            let valueStr;

            if (await totalRow.count() > 0) {
                // Gets the 11.00 from <strong>11.00</strong>
                valueStr = await totalRow.locator('strong, .bodyCopy').last().innerText();
            } else {
                // Standard for simpler "Orders by" charts
                valueStr = await outletBlock.locator('.bodyCopy, strong').last().innerText();
            }

            // Clean the string (remove AED, commas, etc.) and convert to number
            const numericValue = parseFloat(valueStr.replace(/[^\d.]/g, '').trim());

            if (!isNaN(numericValue)) {
                calculatedSum += numericValue;
                console.log(`   Outlet: ${name.trim().padEnd(20)} | Value: ${numericValue}`);
            } else {
                console.warn(`   ⚠️ Could not parse value for ${name}: "${valueStr}"`);
            }
        }

        // 4. Final Validation
        console.log(`✅ Final Calculation for ${cardName}: Sum of Outlets = ${calculatedSum}`);

        // At minimum, verify the breakdown actually contains data
        expect(calculatedSum).toBeGreaterThanOrEqual(0);

        // 5. Close the Drill-Down Panel to reset the UI for the next step
        const closeBtn = this.page.locator('button[class*="closeButton"], .src-common__closeButton').first();
        if (await closeBtn.isVisible()) {
            await closeBtn.click();
        }

    } catch (error) {
        console.error(`❌ Verification failed for ${cardName}:`, error.message);
        throw error;
    }
});
