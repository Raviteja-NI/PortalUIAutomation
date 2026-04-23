const { When, Then } = require('@cucumber/cucumber');
const OrdersPage = require('../PageObjects/OrdersPage');

When('I click on Orders tab', async function () {

    await this.page.getByRole('link', { name: 'Orders' }).click();
});
When('I click on new tab', function () {
    // Write code here that turns the phrase above into concrete actions
  console.log("new feature file got created");
});