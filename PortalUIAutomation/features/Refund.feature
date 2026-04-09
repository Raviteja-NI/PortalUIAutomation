Feature: Verify the Refund Transactions

  Background:  Login as merchant user
    Given I navigate to the sandbox portal

  @Refund
  Scenario:DEP_RFND_005-Verify that Refund Option is available in transaction detailed page for all the POS "Settled" Transactions in Portal-POS
    When I login using "carrefour" user name and password
    When  I click on Orders tab
    And I click on Transactions tab
    And I select "Last 30 days" from "Date" filter
    And I select "pos" from "channel" filter
    And I select "Settled" from "status" filter
    Then I Verify the elgibilty of Refund
  @Refund
  Scenario:DEP_RFND_007-Verify that Refund Option is available in transaction detailed page for all the SoftPOS(ATTP) "Settled" Transactions in Portal
    When  I click on Orders tab
    When I click on Transactions tab
    And I select "Last 30 days" from "Date" filter
    And I select "Soft pos" from "channel" filter
    And I select "Settled" from "status" filter
    Then I Verify the elgibilty of Refund

  @Refund
  Scenario:DEP_RFND_010-Verify that the system prevents submission and display an error message in the Transaction details screen When merchant entered amount exceeds the allowed limit-POS

    When  I click on Orders tab
    When I click on Transactions tab
    And I select "Last 30 days" from "Date" filter
    And I select "pos" from "channel" filter
    And I select "Settled" from "status" filter
    Then I do the more Refund
  @Refund
  Scenario:DEP_RFND_011-Verify that merchant can successfully initiate and submit a valid refund request for a POS transaction through the Portal-POS
    When  I click on Orders tab
    When I click on Transactions tab
    And I select "Last 30 days" from "Date" filter
    And I select "Soft pos" from "channel" filter
    And I select "Settled" from "status" filter
    Then I do the full Refund


  @Refund
  Scenario:DEP_RFND_013-Verify that Refund Transaction should be available in Transaction Screen & sorted with Latest transaction first-POS

    When  I click on Orders tab
    When I click on Transactions tab
    And I select "Last 30 days" from "Date" filter
    And I select "Soft pos" from "channel" filter
    And I select "Settled" from "status" filter
    

  @Refund
  Scenario:DEP_RFND_014-Verify that the Refund Option is NOT available in transaction detailed page of portal when Full Refund Transaction which is already initiated by merchant-POS

    When I click on Transactions tab
    And I select "AED" from "currency" filter
    And I select "pos" from "channel" filter
    And I select "Refunded" from "status" filter

  @Refund
  Scenario:DEP_RFND_023-Verify that merchant can successfully initiate and submit a valid Partial refund request for a POS transaction through the Portal-POS

    When I click on Transactions tab
    And I select "AED" from "currency" filter
    And I select "pos" from "channel" filter
    And I select "Refunded" from "status" filter
  @Refund
  Scenario:DEP_RFND_045-Verify that merchant can successfully initiate and submit a valid refund request for a SoftPOS transaction through the Portal-ATTP

    When I click on Transactions tab
    And I select "AED" from "currency" filter
    And I select "pos" from "channel" filter
    And I select "Refunded" from "status" filter

  @Refund
  Scenario:DEP_RFND_047-Verify that Refund Transaction should be available in Transaction Screen & sorted with Latest transaction first-SoftPOS(ATTP)

    When I click on Transactions tab
    And I select "AED" from "currency" filter
    And I select "pos" from "channel" filter
    And I select "Refunded" from "status" filter

  @Refund
  Scenario:DEP_RFND_049-Verify that merchant can successfully initiate and submit a valid Partial refund request for a SoftPOS transaction through the Portal-ATTP
    When I click on Transactions tab
    And I select "AED" from "currency" filter
    And I select "pos" from "channel" filter
    And I select "Refunded" from "status" filter