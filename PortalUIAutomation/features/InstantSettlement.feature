Feature: Verify the Instant Settlement Functionality

  Background:  Login as merchant user
    Given I navigate to the sandbox portal

  @InstantSettlement1
  Scenario: DEP_INSTSTM_04-Verify that clearly message should be displayed in Portal when On-Demand Settlements are not available due to the rules from the:	Configure working hours (weekly) and holidays per tenant.
    When I login using "carreowner" user name and password
    And I click on Settlements tab
    Then I display the Latest Settlement amount
    And I display the Available for On-Demand amount
    And I verify the Settle Now button visibility and state
    When I click on the Settle now button
    Then I select the MID1 from config
    Then I display the selected MID details and verify settle now button state
    Then I verify the Maximum amount validation error
    Then I verify the Minimum amount validation error
    Then I display the list of all MIDs and their amounts
    Then I verify the Request settlement button state
    And I verify if any MID shows settlement already in progress in the dropdown
  @InstantSettlement
  Scenario: DEP_INSTSTM_05-Verify that the card should be placed in the Settlement card in the portal dashboard.
    When I login using "carreOwner" user name and password
    Then I display the Latest Settlement amount
    And I display the Available for On-Demand amount
    And I verify the Settle Now button visibility and state
  @InstantSettlement
  Scenario: DEP_INSTSTM_06-Verify that the On-Demand Settlements feature is available is available under settlement tab /Screen
    And I click on Settlements tab
    Then I display the Latest Settlement amount
    And I display the Available for On-Demand amount
    And I verify the Settle Now button visibility and state
  @InstantSettlement
  Scenario: DEP_INSTSTM_07-"Verify if it is displaying a clear header: "Available for on demand settlement"" on the portal"
    Then I display the Latest Settlement amount
    And I display the Available for On-Demand amount
    And I verify the Settle Now button visibility and state
  @InstantSettlement
  Scenario: DEP_INSTSTM_08-Verify amount should display in the merchant's local currency (e.g., AED 1,250.00)
    Then I display the Latest Settlement amount
    And I display the Available for On-Demand amount
    And I verify the Settle Now button visibility and state
  @InstantSettlement
  Scenario: DEP_INSTSTM_10-Verify Settle now button is present in the portal"
    Then I display the Latest Settlement amount
    And I display the Available for On-Demand amount
    And I verify the Settle Now button visibility and state
  @InstantSettlement
  Scenario: DEP_INSTSTM_11- Verify Clicking "Settle now" button should trigger the On Demand Settlement Request Initiation Flow
    When I click on the Settle now button
    Then I verify the header "Initiate on demand settlements" is displayed
    Then I verify the Request settlement button state
  @InstantSettlement
  Scenario: DEP_INSTSTM_13-Verify "Settle now" button should be placed within the Settlements Overview Panel under the settlement tab
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_15-Verify If an ODS request is already in progress, "Settle now" button should be hidden
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I verify the Settle Now button visibility and state
  @InstantSettlement
  Scenario: DEP_INSTSTM_17-Verify  when settlement is initiated from the portal, it displays a clear heading: "Settlement Initiated"
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_18-Verify status message include a sub-text confirming the action,"You will receive the settlement shortly."
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_19-Verify "Request Another Settlement" button should reset the ODS flow and return the user to Step 1 (Merchant Selection) & All previous inputs (amount, selected MID) from the finished transaction should be cleared to prevent accidental duplicate entries.
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_20-Verify ""Go to Settlements"" button should redirect the user to the Settlement History/Reporting tab"
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_21-Verify that the user should land on the history list where they can see their newly created "On-Demand" settlement marked as "PROCESSING"
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_22-Verify the system displays a highlighted tag for On‑Demand rows
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_23-Verify the Distinct Labeling: tag or badge should appear each row to identify the ODS settlement type:
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_24-Verify that Settlements Reporting dashboard should distinguish between On-Demand and On-Cycle settlements which includes status-specific labeling, incremental loading (pagination), and a deep-dive "Detail View" to show fee breakdowns and individual transaction data.
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_27-Verify clicking any settlement row should open the Details Panel view
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_28-Verify Overview Info displays the destination IBAN, Timestamp (Date & Time), and Gross Amount
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_29-Verify On Demand Settlement Charges shows the detailed view of  Final Settled Amount
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_30-Verify that On Demand Settlement (ODS)Record & the Settled Amount which is Initiated From Portal is available in Way 4 (CMS)
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_32-Verify that the System Fetch and display a list of all MIDs associated with the user account
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_33-Verify that the System and display all Merchant ID, and AvailableAmount"
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_34-Verify If an ODS is already In Progress"for a specific MID, that row should be disabled/greyed out
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_35-Verify ""Request Settlement"" button remainsinactive until a valid, eligible MID is clicked"
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_36-Verify destination IBAN/Card and total Available for Instant Settlement amount shows clearly
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_37-Verify ""Settle All"" button include a button/link that, when clicked, automatically populates the input field with the maximum available balance"
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_38-Verify ""Numeric input"" field displays with a clear currency prefix (e.g., AED)"
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_39-Verify ""Minimum"" Amount display an inline error message if the entered amount is below the system minimum amount of the daily ODS limit"
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_40-Verify ""Maximum"" Amount display aninline error message if the entered amount  exceeds the daily ODS limit"
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_43-Verify Upon clicking ""Request Settlement,"" show a breakdown summary:
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_44-Verify Final Warning: should display  as below" Charges and VAT will be deducted from your next settlement"
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_45-Verify  A checkbox regarding the Instant Settlement T&Cs and a link for the T&C that redirects the user to a new tab containing the terms and conditions to be reviewed before submitting the request
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_48-Verify the Payment breakdown (Requested settlement, Charges, VAT, Amount settled ) when the ODS Amount Slab (0 - 5000) AED
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_49-Verify the Payment breakdown (Requested settlement, Charges, VAT, Amount settled ) when the ODS Amount Slab (5000 - 10000) AED
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_50-Verify the Payment breakdown (Requested settlement, Charges, VAT, Amount settled ) when the ODS Amount Slab (10000 - 15000) AED
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_51-Verify the Payment breakdown (Requested settlement, Charges, VAT, Amount settled ) when the ODS Amount Slab (15000 - 20000) AED
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record
  @InstantSettlement
  Scenario: DEP_INSTSTM_52-Verify the Payment breakdown (Requested settlement, Charges, VAT, Amount settled ) when the ODS Amount Slab (20000+) AED
    When I login using "carreOwner" user name and password
    And I click on Settlements tab
    Then I verify the Settlement table headers
    And the settlement dates should be in descending order
    And I click on the first settlement record