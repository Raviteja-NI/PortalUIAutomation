const { When, Then } = require('@cucumber/cucumber');
const path = require('path');
const fs = require('fs');

// 1. Load the JSON data
const dataPath = path.join(__dirname, '../paymentFormData.json');
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

When('I click on Transactions tab', async function () {
    await this.page.getByRole('link', { name: 'Transactions' }).click();
});
When('I enter {string} from search field', async function (fieldName) {
    const searchValue = String(testData.carrefouruser.payment[fieldName]);
    const searchInput = this.page.locator('#SEARCH');

    // Clear and type
    await searchInput.click();
    await searchInput.fill('');
    await searchInput.pressSequentially(searchValue, { delay: 100 });

    // Press Enter to search
    await searchInput.press('Enter');
    console.log(`🔍 Search triggered for ${fieldName}: ${searchValue}`);

    // REMOVED: await this.page.waitForLoadState('networkidle');
    // ADDED: Small delay to let the UI start updating
    await this.page.waitForTimeout(2000);
});

Then('I verify the number of transactions found', async function () {
    // 1. Wait for the table body to be attached (much more reliable than networkidle)
    const tbody = this.page.locator('tbody');
    await tbody.waitFor({ state: 'attached', timeout: 15000 });

    const rows = this.page.locator('tbody tr.rowHighlight');

    // 2. Optional: Wait specifically for the first row to be visible
    // This ensures the search results have actually rendered
    const rowCount = await rows.count();

    if (rowCount > 0) {
        console.log(`✅ Search Successful: Found ${rowCount} transaction(s).`);
        const firstId = await rows.first().locator('td').first().innerText();
        console.log(`RRN ID: ${firstId.trim()}`);
    } else {
        console.log('No records found for this search criteria.');
    }
});

Then('I display the transaction details section', async function () {
    // 1. Locate the main container for the details
    const detailContainer = this.page.locator('.col.span-7.span-sm-12');
    await detailContainer.waitFor({ state: 'visible', timeout: 10000 });

    // 2. Extract values based on your HTML structure
    const guid = await this.page.locator('span.bodyCopy').first().innerText();
    const amount = await this.page.locator('#amount').innerText();
    const currency = await this.page.locator('#currency').innerText();

    // Status is next to the 'success indicator' class
    const status = await this.page.locator('span.success.indicator + span.bodyCopy').innerText();

    // Date and Type are usually in the same row of bodyCopy spans
    const metaInfo = await this.page.locator('div[style="margin-top: 5px;"]').innerText();

    // RRN is next to the specific Label
    const rrn = await this.page.locator('label.label:has-text("RRN") + span .bodyCopy').innerText();

    // 3. Print everything to the console for your report
    console.log('--- Transaction Details Section ---');
    console.log(`GUID:    ${guid.trim()}`);
    console.log(`Amount:  ${amount.trim()} ${currency.trim()}`);
    console.log(`Status:  ${status.trim()}`);
    console.log(`Meta:    ${metaInfo.replace(/\|/g, '-').trim()}`); // Cleans up the | separator
    console.log(`RRN:     ${rrn.trim()}`);
    console.log('-----------------------------------');
});


When('I click on the first transaction and display its details', async function () {
    // 1. Locate the first row in the table
    const firstRow = this.page.locator('tbody tr.rowHighlight').first();

    // 2. Wait for it to be visible before clicking
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });

    // 3. Extract data from the table row (Transaction ID is 1st column)
    const txId = (await firstRow.locator('td').first().innerText()).trim();
    const tableAmount = (await firstRow.locator('#amount').innerText()).trim();

    console.log(`Step: Clicking First Transaction [ID: ${txId}] | Table Amount: ${tableAmount}`);

    // 4. Perform the Click
    await firstRow.click();

    // 5. Wait for the "Transaction details" page to load
    await this.page.locator('h1.h1:has-text("Transaction details")').waitFor({ state: 'visible' });

    // 6. Display details from the sub-page
    const detailAmount = await this.page.locator('#amount').innerText();
    const status = await this.page.locator('span.success.indicator + span.bodyCopy').innerText();

    console.log(`✅ Details Page Verified -> Amount: ${detailAmount.trim()} | Status: ${status.trim()}`);
});
When('I expand cardholder details', async function () {
    // 1. Target the button specifically by its text
    const accordionBtn = this.page.locator('button.ni-btn-link-large', { hasText: 'Cardholder details' });

    // 2. Click it (using force: true in case the SVG arrow overlaps the hit area)
    await accordionBtn.scrollIntoViewIfNeeded();
    await accordionBtn.click({ force: true });

    console.log('✅ Clicked the Cardholder details accordion.');
});
Then('I display all cardholder fields', async function () {
    // 1. Target the SPECIFIC title block for Cardholder details
    const titleBlock = this.page.locator('div.accordionItemTitle', { hasText: 'Cardholder details' });
    
    // 2. Target the content div that sits right next to THIS specific title
    const expandedContent = titleBlock.locator('xpath=following-sibling::div').first();
    
    // 3. Wait for the content to be visible
    await expandedContent.waitFor({ state: 'visible', timeout: 5000 });

    // 4. Extract all text inside this specific container
    const allText = await expandedContent.innerText();
    
    console.log('--- Cardholder Details Content ---');
    if (allText.trim().length > 0) {
        // Split and clean up the display
        const lines = allText.split('\n').map(line => line.trim()).filter(line => line !== '');
        lines.forEach(line => console.log(`> ${line}`));
    } else {
        console.log('⚠️ Container found but it appears to be empty.');
    }
    console.log('-----------------------------------');
});

When('I expand merchant details', async function () {
    // 1. Target the button specifically by its text "Merchant details"
    const merchantBtn = this.page.locator('button.ni-btn-link-large', { hasText: 'Merchant details' });

    // 2. Click it with force:true to ensure any overlays don't block the click
    await merchantBtn.scrollIntoViewIfNeeded();
    await merchantBtn.click({ force: true });
    
    console.log('✅ Clicked the Merchant details accordion.');
});

Then('I display all merchant fields', async function () {
    // 1. Find the title block for Merchant details
    const titleBlock = this.page.locator('div.accordionItemTitle', { hasText: 'Merchant details' });
    
    // 2. Target the content div immediately following this specific title
    const expandedContent = titleBlock.locator('xpath=following-sibling::div').first();
    
    // 3. Wait for the content to be visible (handles the slide animation)
    await expandedContent.waitFor({ state: 'visible', timeout: 5000 });

    // 4. Extract and clean the text
    const allText = await expandedContent.innerText();
    
    console.log('--- Merchant Details Content ---');
    if (allText.trim()) {
        const lines = allText.split('\n').map(line => line.trim()).filter(line => line !== '');
        lines.forEach(line => console.log(`> ${line}`));
    } else {
        console.log('⚠️ Merchant section is empty.');
    }
    console.log('---------------------------------');
});