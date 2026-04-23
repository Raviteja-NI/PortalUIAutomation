Feature: Verify the Settlement Functionality

  Background:  Login as merchant user
    Given I navigate to the sandbox portal

  @Settlement
  Scenario:DEP_SLMT_03_Verify that merchant admin is directed to a page that displays a list of their settlements upon clicking the "Settlements" tab.
    When I login using "carrefour" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record


  @Settlement
  Scenario:DEP_SLMT_04_Verify that the Settlement list view should display the required data for each settlement record when merchant navigate to settlement page.
    When I click on Settlements tab
    And I select "pos" from "channel" filter
    Then I click on the first settlement record for "carrefouruser" as per way4 netamount
    When I expand settled transactions
  @Settlement
  Scenario:DEP_SLMT_05_Verify that the Settlement list view is displayed with a default sort order of reverse chronological (newest settlements first) based on the Settlement Date when merchant navigate to settlement page.
    When I click on Settlements tab
    And I select "pos" from "channel" filter
    Then I click on the first settlement record for "carrefouruser" as per way4 netamount
    When I expand settled transactions
  @Settlement
  Scenario:DEP_SLMT_06_Verify that Settlement Details page is displayed when merchant click the settlement record in the list & successfully navigate.

    When I click on Settlements tab
    And I select "pos" from "channel" filter
    Then I click on the first settlement record for "carrefouruser" as per way4 netamount
    When I expand settled transactions
  @Settlement @logout
  Scenario:DEP_SLMT_010_Verify that settlement record list is display Transaction record for all the MID grouped per channel with settlement Status - Settled  for by Group settlements by channel: Soft POS (ATTP)
    When I login using "attp" user name and password
    And I click on Settlements tab
    And I select "soft pos" from "channel" filter
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record

  @Settlement @logout
  Scenario:DEP_SLMT_011_Verify that settlement record list is display Transaction record for all the MID grouped per channel with settlement Status - Settled  for by Group settlements by channel: POS.
    When I login using "carrefour" user name and password
    When I click on Settlements tab
    And I select "pos" from "channel" filter
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @Settlement
  Scenario:DEP_SLMT_14_Verify that the user is able to filter settlement records using the Date filter and that the system correctly displays settlement records corresponding to the selected date range (e.g., Last 14 days).
    When I click on Settlements tab
    And I select "pos" from "channel" filter
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @Settlement
  Scenario:DEP_SLMT_17_Verify that merchant is able to accessing the Settlement List and navigating to the Settlement Details to view settlement batch for POS Transaction.
    When I click on Settlements tab
    And I select "pos" from "channel" filter
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @Settlement
  Scenario:DEP_SLMT_21_Verify that all records with the 'Settlement' status (Settled) are correctly displayed in the comprehensive Settlement Overview Panel on the Settlement Details page, provided that all related transactions have been fully processed and settled in Way4.
    When I click on Settlements tab
    And I select "pos" from "channel" filter
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @Settlement
  Scenario:DEP_SLMT_29_Verify that the list of settled transactions displays the required data points for each record when the merchant clicks on a transaction in the Transaction Details page for a “Settled” E‑Com record. Additionally, ensure that each transaction in the list is clickable and successfully navigates the user to its corresponding Transaction Details page.


    when I click on Settlements tab
    And I select "pos" from "channel" filter
    And I select date range from "14/04/2026" to "14/04/2026"
    Then I click on the first settlement record for "carrefouruser" as per way4 netamount
    When I expand settled transactions
    Then I click on each settlement row and display its type
  @Settlement
  Scenario:DEP_SLMT_30_Verify that the list of settled transactions displays the required data points for each record when the merchant clicks on a transaction in the Transaction Details page for a “Settled” E‑Com record.
    when I click on Settlements tab
    And I select "pos" from "channel" filter
    And I select date range from "14/04/2026" to "14/04/2026"
    Then I click on the first settlement record for "carrefouruser" as per way4 netamount
    When I expand settled transactions
  @Settlement
  Scenario:DEP_SLMT_31_Verify that the list of settled transactions displays the required data points for each record when the merchant clicks on a transaction in the Transaction Details page for a “Settled” E‑Com record.
    when I click on Settlements tab
    And I select "pos" from "channel" filter
    And I select date range from "14/04/2026" to "14/04/2026"
    Then I click on the first settlement record for "carrefouruser" as per way4 netamount
    When I expand settled transactions
  @Settlement
  Scenario:DEP_SLMT_32_Verify that the list of settled transactions displays the required data points for each record when the merchant clicks on a transaction in the Transaction Details page for a “Settled” E‑Com record
    when I click on Settlements tab
    And I select "pos" from "channel" filter
    And I select date range from "14/04/2026" to "14/04/2026"
    Then I click on the first settlement record for "carrefouruser" as per way4 netamount
    When I expand settled transactions
  @Settlement
  Scenario:DEP_SLMT_33_Verify that POS (Pre-Auth) transactions are not considered for settlement and therefore do not appear in the list of settled transactions when the merchant views the Transaction Details page for a “Settled” POS record.
    when I click on Settlements tab
    And I select "pos" from "channel" filter
    And I select date range from "14/04/2026" to "14/04/2026"
    Then I click on the first settlement record for "carrefouruser" as per way4 netamount
    When I expand settled transactions
  @Settlement
  Scenario:DEP_SLMT_43_Verify that the Settlement Summary displays the Final Settlement Amount , providing a clear breakdown of settlement values—including the Net Amount—when the merchant clicks the Settlement Summary link, ensuring the financial outcome of the settlement batch is accurately presented-Net amount

    when I click on Settlements tab
    And I select "pos" from "channel" filter
    And I select date range from "14/04/2026" to "14/04/2026"
    Then I click on the first settlement record for "carrefouruser" as per way4 netamount
    When I expand settled transactions