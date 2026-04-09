class SummaryPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;

        // 1. Locators: Define your page elements here
        this.totalvalue = page.locator("//*[text()='Total Value']/../../div/div/span/h3[@id='amount']");
        this.payments = page.locator("//*[text()='Payments']/../../div/../div/h3");
        this.refund = page.locator("//*[text()='Refund']/../../div/../div/h3");
        this.refundAmount = page.locator("//*[text()='Refund Amount']/../../div/div/span/h3[@id='amount']");
        this.defaultDate = page.locator("//div/span[@class='selectedDateValue']");
        this.todayDate = page.locator("//div/input[@id='Today']");
        this.defaultCurrency = page.locator("//div[@id='selectedText']/span[text()='AED']");
        this.defaultChannel = page.locator("//div[@id='selectedText']/span[text()='4 selected']");
        this.defaultPaymentStatus = page.locator("//div[@id='selectedText']/span[text()='1 selected']");
        // this.yesterdayLabel = page.locator('label.label.large', { hasText: 'Yesterday' });
        // In SummaryPage constructor
        this.getYesterdayLocator = (title) =>
            this.page.locator('#kpi-stat-card')
                .filter({ has: this.page.locator('span.bodyCopy', { hasText: new RegExp(`^${title}$`) }) })
                .locator('label.label.large');


        this.totalValueYesterday = this.getYesterdayLocator('Total Value');
        this.paymentsYesterday = this.getYesterdayLocator('Payments');
        this.refundYesterday = this.getYesterdayLocator('Refund');
        this.refundAmountYesterday = this.getYesterdayLocator('Refund Amount');

    }

    // 2. Actions: Define methods to interact with the page
    async getTotalValue() {
        await this.totalvalue.waitFor({ state: 'visible', timeout: 10000 });
        return await this.totalvalue.textContent();
    }

    async getPayments() {
        return await this.payments.textContent();
    }

    async getRefund() {
        return await this.refund.textContent();
    }

    async getRefundAmount() {
        return await this.refundAmount.textContent();
    }

    async getDate() {
        let text = await this.defaultDate.getAttribute('value');

        text = await this.defaultDate.innerText();

        return text;
    }
    // async yesterdayActivityValue() {
    //     return await this.yesterdayLabel.textContent();
    // }
    async getTotalValueYesterday() {
        return await this.totalValueYesterday.innerText();
    }

    async getPaymentsYesterday() {
        return await this.paymentsYesterday.innerText();
    }

    async getRefundYesterday() {
        return await this.refundYesterday.innerText();
    }

    async getRefundAmountYesterday() {
        return await this.refundAmountYesterday.innerText();
    }


    async selectDate() {
        await this.defaultDate.click();
        const todayLabel = this.page.locator('label[for="Today"]');
        await todayLabel.waitFor({ state: 'visible' });
        await todayLabel.click({ force: true });

        console.log("✅ today date selected");
        await this.page.waitForTimeout(1000);

        const dateVal = await this.getDate();
        console.log("Date Selected  is: " + dateVal);

    }
}

// Export the class for use in your test files
module.exports = { SummaryPage };
