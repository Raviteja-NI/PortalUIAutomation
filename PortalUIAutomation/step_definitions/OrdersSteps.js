const { When, Then } = require('@cucumber/cucumber');
const OrdersPage = require('../PageObjects/OrdersPage');

When('I click on Orders tab', async function () {

    await this.page.getByRole('link', { name: 'Orders' }).click();
});