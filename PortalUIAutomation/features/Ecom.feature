Feature: Verify the Ecom Dashboard Page

    Background:  Login as merchant user
        Given I navigate to the sandbox portal


    @Smoke
    Scenario: Create Ecom Transaction with AANY
        When I login using "aany" user name and password
        When I click on Payments tab
        When I Create New Payment Link
        When  I Complete Payment Link
        Then I Verify Payment Creation Status

    @Smoke
    Scenario: Create Ecom Transaction with TAABY BNPL
        When I login using "tabby" user name and password
        When I click on Payments tab
        When I Create New Payment Link
        When I Complete Payment Link
        Then I Verify Payment Creation Status

    @Regression
    Scenario: Create Ecom Transaction with single card
        When I login using "carrefour" user name and password
        When I click on Payments tab
        When I Create New Payment Link
        When I Complete Payment Link
        Then I Verify Payment Creation Status

    @Regression1
    Scenario: Create Ecom Transactions for all cards
        When I login using "carrefour" user name and password
        And I do ECOM transactions for all cards in CSV file
        Then I Verify Payment Creation Status
