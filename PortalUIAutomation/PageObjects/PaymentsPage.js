// PageObjects/PaymentsPage.js
const path = require('path');
const fs = require('fs');
const { expect } = require('@playwright/test');

class PaymentsPage {
  /**
   * @param {import('@playwright/test').Page} page
   * @param {string} userType      // e.g., 'carrefouruser', 'mdeuser', 'mcpuser'
   */
  constructor(page, userType) {
    this.page = page;
    this.context = page.context();
    this.userType = userType;

    const dataPath = path.join(__dirname, '../paymentFormData.json');
    const json = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    // Debug aid (leave in until green)
    if (!json || typeof json !== 'object') {
      throw new Error('paymentFormData.json could not be parsed or is empty.');
    }
    if (!this.userType) {
      throw new Error('userType was not provided to PaymentsPage constructor.');
    }
    if (!json[this.userType]) {
      const keys = Object.keys(json);
      throw new Error(`❌ No paymentFormData found for userType: ${this.userType}. Available keys: ${keys.join(', ')}`);
    }

    this.data = json[this.userType];
  }

  async createNewPaymentLink() {
    const { customer, payment } = this.data;

    await this.page.getByRole('link', { name: 'Payments' }).click();
    await this.page.getByRole('button', { name: 'New' }).click();

    await this.page.getByRole('button', { name: 'Outlet *' }).click();
    await this.page.getByText(payment.outlet, { exact: true }).click();

    await this.page.getByRole('textbox', { name: 'First name *' }).fill(customer.firstName);
    await this.page.getByRole('textbox', { name: 'Last name *' }).fill(customer.lastName);

    await this.page.getByRole('textbox', { name: 'Email *' }).fill(customer.email);
    if (customer.bccEmail) {
      await this.page.getByRole('textbox', { name: 'BCC email (optional)' }).fill(customer.bccEmail);
    }

    await this.page.locator('div').filter({ hasText: /^Supported transaction types \*$/ }).nth(2).click();
    await this.page.getByText(payment.transactionType).click();

    await this.page.getByRole('button', { name: 'Currency *' }).click();
    await this.page.getByText(payment.currency).click();

    await this.page.getByRole('textbox', { name: 'Item description *' }).fill(payment.itemDescription);
    await this.page.getByRole('textbox', { name: 'Amount *' }).fill(String(payment.amount));

    await this.page.getByRole('button', { name: 'Send' }).click();
    await this.page.waitForTimeout(1000);
  }

  // MDE-style flow (separate fields)
  async mdePaymentFlow(card) {
    const page1 = await this._openLatestPaymentLink();

    await page1.getByRole('textbox', { name: 'Card Number' }).fill(card.number);
    await page1.getByRole('textbox', { name: 'Expiry Month' }).fill(card.expiryMonth);
    await page1.getByRole('textbox', { name: 'Expiry Year' }).fill(card.expiryYear);
    await page1.getByRole('textbox', { name: 'Security Code' }).fill(card.cvv);
    await page1.getByRole('textbox', { name: 'Name on card' }).fill(card.nameOnCard);

    await page1.locator('//div/span/span[@id="amount"]').click();

    await page1.locator('[data-testid="3ds_iframe"]').waitFor({ state: 'attached', timeout: 45000 });
    const threeDS = page1.frameLocator('[data-testid="3ds_iframe"]');
    await threeDS.getByRole('button', { name: /Authentication Successful/i }).click({ timeout: 30000 });

    if (!page1.isClosed()) {
      await page1.waitForTimeout(3000);
      await page1.close();
    }


  }

  // Carrefour flow (single expiry input + redirect)
  async carrefourPaymentFlow(card) {
    const page1 = await this._openLatestPaymentLink();

    await page1.locator('#CARD_NUMBER').fill(card.number);
    // await page1.getByTestId('card-number-input').fill(card.number);
    //await page1.getByTestId('expiry-date-input').dblclick();
    //await page1.getByTestId('expiry-date-input').fill(card.expiryDate);
    //await page1.getByTestId('cvv-input').fill(card.cvv);
    //await page1.getByTestId('cardholder-name-input').fill(card.nameOnCard);

    //await page1.getByTestId('card-pay-button').click();
    //await page1.getByTestId('redirect-button').click();
    //await page1.getByRole('button', { name: 'OK' }).click();
    await page1.locator('#CARD_NUMBER').fill(card.number);
    await page1.locator('#EXPIRY_MONTH').fill(card.expiryMonth);
    await page1.locator('#EXPIRY_YEAR').fill(card.expiryYear);
    await page1.locator('#CVV').fill(card.cvv);
    await page1.locator('#CARD_HOLDER_NAME').fill(card.nameOnCard);

    // Use a button locator that matches your UI (Role is usually safest)
    await page1.getByRole('button', { name: /Pay|Submit/i }).first().click();
  }
  async aanyPaymentFlow() {
    const page1 = await this._openLatestPaymentLink();
    await page1.getByTestId('other-payment-method-aani').click();
    await page1.getByTestId('anni-qr-pay-button').click();
    // await page1.getByRole('checkbox', { name: 'tabbyInstallments' }).click();
    // await page1.getByRole('button', { name: 'Pay AED' }).click();
    // await page1.getByRole('button', { name: 'Authorise Payment' }).click();
    try {
      await page1.getByRole('button', { name: 'Close' }).click({ timeout: 5000 });
    } catch (e) {
      console.log("Close button not found or already closed");
    }

    // 🟢 MAYA FIX: Always close the tab to save memory
    if (page1 && !page1.isClosed()) {
      await page1.close();
    }
  }
  async tabbyPaymentFlow() {
    const page1 = await this._openLatestPaymentLink();

    await page1.getByRole('checkbox', { name: 'tabbyInstallments' }).click();
    await page1.getByRole('button', { name: 'Pay AED' }).click();
    await page1.getByRole('button', { name: 'Authorise Payment' }).click();
    try {
      await page1.getByRole('button', { name: 'Close' }).click({ timeout: 5000 });
    } catch (e) {
      console.log("Close button not found or already closed");
    }

    // 🟢 MAYA FIX: Always close the tab to save memory
    if (page1 && !page1.isClosed()) {
      await page1.close();
    }
  }

  // helper: open the latest Pay Link in a new page
  async _openLatestPaymentLink() {
    await this.page.waitForTimeout(10_000);
    await this.page.getByRole('link', { name: 'Payments' }).click();
    const rowAmount = this.page.locator('#amount').filter({ hasNot: this.page.locator('[disabled]') }).first();
    await rowAmount.scrollIntoViewIfNeeded();
    await rowAmount.click();

    await this.page.getByRole('button', { name: 'shearBtn Share' }).click(); // if typo, keep as per app
    const PaymentLink = await this.page.locator('#PAYMENT_LINK').inputValue();
    await this.page.locator('button.ni-btn.ni-btn-link').click();

    const page1 = await this.page.context().newPage();
    await page1.goto(PaymentLink, { waitUntil: 'domcontentloaded', timeout: 60000 });
    return page1;
  }


  // NEW METHOD: Specifically for CSV data
  async createNewPaymentLinkFromCSV(cardData) {


    const { customer, payment } = this.data; // Keep static email/outlet from JSON

    await this.page.getByRole('link', { name: 'Payments' }).click();
    await this.page.getByRole('button', { name: 'New' }).click();

    await this.page.getByRole('button', { name: 'Outlet *' }).click();
    await this.page.getByText(payment.outlet, { exact: true }).click();

    // Use Name from CSV for First Name, or split it
    const firstName = cardData.Name.split(' ')[0];
    const lastName = cardData.Name.split(' ')[1] || 'User';

    await this.page.getByRole('textbox', { name: 'First name *' }).fill(firstName);
    await this.page.getByRole('textbox', { name: 'Last name *' }).fill(lastName);

    await this.page.getByRole('textbox', { name: 'Email *' }).fill(customer.email);

    await this.page.locator('div').filter({ hasText: /^Supported transaction types \*$/ }).nth(2).click();
    await this.page.getByText(payment.transactionType).click();

    await this.page.getByRole('button', { name: 'Currency *' }).click();
    await this.page.getByText(payment.currency).click();

    await this.page.getByRole('textbox', { name: 'Item description *' }).fill(`Payment for ${cardData.Name}`);

    // IMPORTANT: Use Amount from CSV Row
    await this.page.getByRole('textbox', { name: 'Amount *' }).fill(String(cardData.Amount));

    await this.page.getByRole('button', { name: 'Send' }).click();
    await this.page.waitForTimeout(1000);
  }

}

module.exports = PaymentsPage;