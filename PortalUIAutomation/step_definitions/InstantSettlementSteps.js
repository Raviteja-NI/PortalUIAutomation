const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');


When('I click on the Settle now button', async function () {
    const settleNowBtn = this.page.getByRole('button', { name: 'Settle now' });

    // Ensure button is enabled before clicking
    await expect(settleNowBtn).toBeEnabled({ timeout: 10000 });
    await settleNowBtn.click();
});
Then('I display the Latest Settlement amount', async function () {
    await this.page.waitForTimeout(5000);
    // Find the 'Latest settlement' label first, then get its sibling amount
    const amount = await this.page
        .locator('span:has-text("Latest settlement")')
        .locator('xpath=../..') // Move up to the container
        .locator('#amount')
        .first() // Specifically take the first occurrence in the top section
        .textContent();

    console.log(`>>> Latest Settlement Amount: ${amount.trim()}`);
});

Then('I display the Available for On-Demand amount', async function () {
    await this.page.waitForTimeout(5000);
    // Target the specific section for On-Demand to avoid the conflict
    const amount = await this.page
        .locator('span:has-text("Available for on demand settlement")')
        .locator('xpath=../..') // Move up to the container
        .locator('#amount')
        .textContent();

    console.log(`>>> Available for On-Demand Amount: ${amount.trim()}`);
});

Then('I verify the Settle Now button visibility and state', async function () {
    const settleNowBtn = this.page.getByRole('button', { name: 'Settle now' });

    await expect(settleNowBtn).toBeVisible();
    const isEnabled = await settleNowBtn.isEnabled();

    console.log(`>>> Settle Now Button is ${isEnabled ? 'ENABLED' : 'DISABLED'}`);
});
Then('I verify if any MID shows settlement already in progress in the dropdown', async function () {
    // 1. Open the MID dropdown
    const midDropdown = this.page.locator('#midBalance button.toggle');
    await midDropdown.click();

    // 2. Locate the status message "Settlement is already in progress"
    // This finds the specific span inside the list
    const statusMessage = this.page.locator('span', {
        hasText: 'Settlement is already in progress'
    }).first(); // Takes the first one it finds

    // 3. Verify it is visible
    await expect(statusMessage).toBeVisible({ timeout: 5000 });

    // 4. Capture the MID number associated with this status to display it
    const midContainer = statusMessage.locator('xpath=../../..'); // Move up to the container with MID text
    const midValue = await midContainer.locator('.src-pages-settlements-on-demand-settlement__optionMid--kGSwc').textContent();

    console.log(`>>> Found MID: ${midValue.trim()} with status: Settlement is already in progress`);
});
Then('I display the list of all MIDs and their amounts', async function () {
    // 1. Ensure dropdown is open
    const midDropdown = this.page.locator('#midBalance button.toggle');
    await midDropdown.click();

    // 2. Locate all MID rows in the dropdown
    const midRows = this.page.locator('.src-pages-settlements-on-demand-settlement__midOptionText--VChPY');

    // Wait for at least one row to be visible
    await expect(midRows.first()).toBeVisible({ timeout: 5000 });

    // 3. Count the number of MIDs found
    const count = await midRows.count();
    console.log(`>>> Found ${count} MIDs in the list:`);

    // 4. Loop through and print each MID and Amount
    for (let i = 0; i < count; i++) {
        const mid = await midRows.nth(i).locator('.src-pages-settlements-on-demand-settlement__optionMid--kGSwc').textContent();
        const amount = await midRows.nth(i).locator('.src-pages-settlements-on-demand-settlement__optionAmount--atAc1').textContent();

        console.log(`   - MID: ${mid.trim()} | Balance: ${amount.trim()}`);
    }
});
Then('I verify the Request settlement button state', async function () {
    // Locate the specific "Request settlement" button
    const requestBtn = this.page.getByRole('button', { name: 'Request settlement' });

    // Check visibility first
    await expect(requestBtn).toBeVisible();

    // Check if it is enabled or disabled
    const isEnabled = await requestBtn.isEnabled();

    if (isEnabled) {
        console.log(">>> Request settlement button is ENABLED");
    } else {
        console.log(">>> Request settlement button is DISABLED");
    }
});
Then('I select the first MID and display its details', async function () {
    // 1. Open the MID dropdown
    const midDropdown = this.page.locator('#midBalance button.toggle');
    await midDropdown.click();

    // 2. Target the first option container and click it
    // We use .first() to pick the top-most MID in the list
    const firstOption = this.page.locator('.options .option').first();
    await expect(firstOption).toBeVisible({ timeout: 5000 });

    // Clicking the div container is often more reliable than the hidden input
    await firstOption.click();

    // 3. Wait for the detail card to appear (the Merchant ID info row)
    const detailRow = this.page.locator('.src-pages-settlements-on-demand-settlement__midInfoRow--TT6ey').first();

    // Increased wait time to 15s in case the backend is slow to fetch the balance
    await expect(detailRow).toBeVisible({ timeout: 15000 });

    // 4. Extraction Helper
    const getRowValue = async (labelText) => {
        return await this.page
            .locator('.src-pages-settlements-on-demand-settlement__midInfoRow--TT6ey', { hasText: labelText })
            .locator('span')
            .last()
            .textContent();
    };

    // 5. Log the Details
    const merchantID = await getRowValue('Merchant ID');
    const transferTo = await getRowValue('Transfer to');
    const availableAmount = await getRowValue('Available for instant settlement');

    console.log(`>>> Selection Details:`);
    console.log(`    - Merchant ID: ${merchantID.trim()}`);
    console.log(`    - Transfer To: ${transferTo.trim()}`);
    console.log(`    - Available: ${availableAmount.trim()}`);
});
Then('I select the MID1 from config', async function () {
    // 1. Read MID1 from paymentFormData.json
    const dataPath = path.join(__dirname, '../paymentFormData.json');
    const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const targetMID = testData.carrefouruser.payment.MID1; 

    // 2. Click on the MID element (the dropdown toggle)
    const midDropdown = this.page.locator('#midBalance');
    await midDropdown.click();

    // 3. Click the Search box and Search for MID1
    const searchBox = this.page.getByRole('textbox', { name: 'Search' });
    await searchBox.click();
    await searchBox.fill(targetMID);
    await searchBox.press('Enter');

    // 4. Select the MID1 from the search results
    // We use the exact text from your config to click the correct result
    const midOption = this.page.getByText(targetMID).first();
    await expect(midOption).toBeVisible({ timeout: 5000 });
    await midOption.click();

    console.log(`>>> MID ${targetMID} searched and selected successfully.`);
});
Then('I display the selected MID details and verify settle now button state', async function () {
    // 1. Wait for the detail card to appear
    const detailCard = this.page.locator('.src-pages-settlements-on-demand-settlement__midInfoRow--TT6ey').first();
    await expect(detailCard).toBeVisible({ timeout: 10000 });

    // 2. Helper function to find the value span based on the label text
    const getDetailValue = async (label) => {
        return await this.page
            .locator('.src-pages-settlements-on-demand-settlement__midInfoRow--TT6ey', { hasText: label })
            .locator('span')
            .last()
            .textContent();
    };

    // 3. Extract and display the information
    const merchantID = await getDetailValue('Merchant ID');
    const transferTo = await getDetailValue('Transfer to');
    const availableAmt = await getDetailValue('Available for instant settlement');

    console.log(`>>> Selection Summary:`);
    console.log(`    - Merchant ID: ${merchantID.trim()}`);
    console.log(`    - Transfer To: ${transferTo.trim()}`);
    console.log(`    - Available Balance: ${availableAmt.trim()}`);

    // 4. Verify the "Settle All Amount" link button is visible
    const settleAllBtn = this.page.getByRole('button', { name: 'Settle All Amount' });
    await expect(settleAllBtn).toBeVisible();
    console.log(`>>> "Settle All Amount" button is visible.`);

    // 5. Verify the main "Request settlement" button is ENABLED
    const requestSettlementBtn = this.page.getByRole('button', { name: 'Request settlement' });
    await expect(requestSettlementBtn).toBeEnabled({ timeout: 5000 });
    
    console.log(`>>> "Request settlement" button is ENABLED and ready.`);
});
Then('I verify the Minimum amount validation error', async function () {
    const amountInput = this.page.locator('input[inputmode="decimal"]');
    
    // 1. Enter 0 to trigger minimum error
    await amountInput.fill('0');
    await amountInput.press('Tab'); // Blur the field to trigger validation

    // 2. Verify error message
    const minError = this.page.getByText('Minimum amount should be 1 AED', { exact: false });
    await expect(minError).toBeVisible({ timeout: 5000 });
    
    console.log(">>> Confirmed: Minimum amount validation error is displayed.");
});

Then('I verify the Maximum amount validation error', async function () {
    const amountInput = this.page.locator('input[inputmode="decimal"]');
    
    // 1. Get the current Available Amount from the UI to determine the "Max"
    const availableText = await this.page
        .locator('.src-pages-settlements-on-demand-settlement__midInfoRow--TT6ey', { hasText: 'Available for instant settlement' })
        .locator('span').last().textContent();
    
    // Extract numeric value (e.g., "505.8" from "505.8 AED")
    const maxLimit = availableText.split(' ')[0].trim();
    const overLimit = (parseFloat(maxLimit) + 10).toString();

    console.log(`>>> Current Max Limit: ${maxLimit}. Entering: ${overLimit}`);

    // 2. Enter an amount higher than the limit
    await amountInput.fill(overLimit);
    await amountInput.press('Tab');

    // 3. Verify error message: "Maximum amount is [maxLimit] AED."
    const maxError = this.page.getByText(`Maximum amount is ${maxLimit} AED`, { exact: false });
    await expect(maxError).toBeVisible({ timeout: 5000 });
    
    // 4. Verify 'Request settlement' button is disabled
    const requestBtn = this.page.getByRole('button', { name: 'Request settlement' });
    await expect(requestBtn).toBeDisabled();

    console.log(`>>> Confirmed: Maximum amount validation error for ${maxLimit} AED is displayed.`);
});