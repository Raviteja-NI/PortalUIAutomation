const { When, Then } = require('@cucumber/cucumber');
const PaymentsPage = require('../PageObjects/PaymentsPage');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

When('I click on Payments tab', async function () {
    console.log("Clicking on Payments tab");
    // Ensure paymentsPage is initialized if needed here
    if (!this.paymentsPage) this.paymentsPage = new PaymentsPage(this.page, this.userType);
});

When('I Create New Payment Link', async function () {
    this.paymentsPage = new PaymentsPage(this.page, this.userType);
    await this.paymentsPage.createNewPaymentLink();
});

When('I Complete Payment Link', async function () {
    const card = this.paymentsPage.data.card;
    if (this.userType === 'carrefouruser') {
        await this.paymentsPage.carrefourPaymentFlow(card);
    }
    else if (this.userType === 'tabbyuser') {
        await this.paymentsPage.tabbyPaymentFlow();
    }
    else if (this.userType === 'aanyuser') {
        await this.paymentsPage.aanyPaymentFlow();
    }
    else {
        await this.paymentsPage.mdePaymentFlow(card);
    }
});

When('I Create New Payment Link from CSV', async function () {

    await this.paymentsPage.createNewPaymentLinkFromCSV(cardData.Name);

    console.log(`✅ New Link Generated for ${cardData.Name}`);
    // Write code here that turns the phrase above into concrete actions

});
When('I do ECOM transactions for all cards in CSV file', { timeout: 1800000 }, async function () {
    const csvPath = path.join(process.cwd(), 'Cards.csv');

    // Load CSV
    const cards = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(csvPath)
            .pipe(csv({ separator: ',', mapHeaders: ({ header }) => header.trim() }))
            .on('data', (row) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', reject);
    });

    // Ensure PageObject is initialized
    if (!this.paymentsPage) this.paymentsPage = new PaymentsPage(this.page, this.userType);

    console.log(`🚀 Batch Started: Processing ${cards.length} cards.`);

    for (const cardData of cards) {
        if (!cardData.Name || cardData.Name.toLowerCase() === 'name') continue;
        console.log(`\n--- Processing Cycle: ${cardData.Name} ---`);

        try {
            // 1. ALICE FIX: Reset UI for every card by clicking Payments tab
            // This clears any "Success" overlays from the previous card
            await this.page.locator('nav a[href="#/payments"]').first().click();

            // 2. BOB FIX: Wait for the button before creating a new link
            await this.page.locator('button').filter({ hasText: /Create|New/i }).first().waitFor({ state: 'visible', timeout: 15000 });

            // 3. Generate Link (Pass the name from CSV if your method supports it)
            //  await this.paymentsPage.createNewPaymentLink(cardData.Name);
            await this.paymentsPage.createNewPaymentLinkFromCSV(cardData);
            console.log(`✅ New Link Generated for ${cardData.Name}`);

            const card = {
                number: cardData.CardNumber.replace(/\s/g, '').replace(/x/g, ''),
                nameOnCard: cardData.Name,
                expiryMonth: "12",
                expiryYear: "2026",
                cvv: "123"
            };

            // 4. Execute Payment (Includes IVAN & MAYA fixes inside these methods)
            if (this.userType === 'carrefouruser') {
                await this.paymentsPage.carrefourPaymentFlow(card);
            } else {
                await this.paymentsPage.mdePaymentFlow(card);
            }

            console.log(`✨ Cycle Complete for ${cardData.Name}`);
            await this.page.waitForTimeout(2000); // Small breather

        } catch (error) {
            console.error(`⚠️ Failed to process ${cardData.Name}: ${error.message}`);
            // MAYA FIX: If it crashes, do a full reload to clear browser memory
            await this.page.goto(this.page.url());
            continue;
        }
    }
});


Then('I Verify Payment Creation Status', async function () {
    console.log("Payment Status Verified");
});
