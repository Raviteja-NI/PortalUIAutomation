Feature: Verify the Ecom Dashboard Page

    Background:  Login as merchant user
        Given I navigate to the sandbox portal
        When I login using "mde" user name and password

    @Refund
    Scenario: Verify Filters in Orders page
        When  I click on Orders tab
        And I select "AED" from "currency" filter
        And I select "Successful" from "payment Status" filter
        Then I verify the number of filtered orders
        And I do the full Refund
