Feature: Verify the Dashboard Page for Ecom and ATTP

  Background:  Login as merchant user
    Given I navigate to the sandbox portal


  @Dashboard
  Scenario: Verify Today's activity metrics card_Before Ecom Transaction
    When I login using "mcp" user name and password
    And I Verify Defualt filter Data
    And I Verify Todays Value


  @Dashboard
  Scenario: Verify Total Payment Volume_Before Ecom Transaction

    When I select "Today" from "Date" filter
    Then I Verify "Total Sales"
    And I Verify "Average Transaction Value"
    And I Verify "Total transactions"

  @Dashboard
  Scenario: Verify defualt graphs Section_Before Ecom Transaction
    When I select "Today" from "Date" filter
    Then I Verify Ecom Pie charts
    And  I Verify Acceptance rate piechart
    And  I Verify Top 5 declines piechart
    And  I Verify Sales by payment type piechart


  @Dashboard
  Scenario: Verify Order graphs in pie Chart Section __Before Ecom Transaction
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    And  I Verify "Orders by currency" piechart
    And  I Verify "Orders by Shopper IP Country" piechart
    And  I Verify "Orders by Issuing Country" piechart
    And  I Verify "Orders by Shopper Type" piechart
    And  I Verify "Orders by Collection Status" piechart
  @Dashboard @logout
  Scenario: Create Ecom Transactions for all cards
    When I login using "mcp" user name and password
    When I do ECOM transactions for all cards in CSV file
    Then I Verify Payment Creation Status

  @Dashboard1
  Scenario: Create Ecom Transaction with single card
    When I login using "mcp" user name and password
    When I click on Payments tab
    When I Create New Payment Link
    When I Complete Payment Link
    Then I Verify Payment Creation Status


  @Regression1
  Scenario: Verify Dashboard Filters Functionality
    When I login using "mcp" user name and password
    When I click clear on the "channel" filter in Summary Page
    When I select "POS" from "channel" filter
    And I select "SOFT_POS" from "channel" filter
    And I select "MOTO" from "channel" filter
    Then I Verify Ecom Pie charts

  @Regression2
  Scenario: Verify Dashboard Filters Functionality for 07 days
    When I select "POS" from "channel" filter
    And I select "SOFT_POS" from "channel" filter
    And I select "MOTO" from "channel" filter
    And I select "Last 7 days" from "Date" filter
    Then I Verify Ecom Pie charts


  @Dashboard
  Scenario:REG_DBP_01-Verify that Dashboard Default view with auto selected filter below & only 4 pie-chart is displayed
    When I login using "mcp" user name and password
    When I Verify Defualt filter Data
    And I select "Today" from "Date" filter
    And I Verify Todays Value
    And I Verify Yesterday Value
    Then I Verify Ecom Pie charts
  @Dashboard
  Scenario:REG_DBP_02-Verify that all the 8 charts are displayed correctly with channel "E-commerce" .
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
  @Dashboard
  Scenario:REG_DBP_03-Verify that all the 4 Pie-Charts are displayed with Mixed Channels as "E-commerce" along with "SoftPOS"
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    And I select "SOFT_POS" from "channel" filter
    Then I Verify Ecom Pie charts

  @Dashboard @logout
  Scenario:REG_DBP_04-Verify that all the 4 Pie-Charts are displayed with  Channels as "SoftPOS"
    When I login using "attp" user name and password
    And I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    Then I Verify Ecom Pie charts

  @Dashboard @logout
  Scenario:REG_DBP_05-Verify that all filters reset to defaults & only the 4 Channel Insight pie charts are displayed after navigates back to summary page
    When I login using "mcp" user name and password
    And I select "Today" from "Date" filter
    And I click on Orders tab
    And I click on Summary tab
    And I Verify Defualt filter Data
    Then I Verify Ecom Pie charts

  @Dashboard
  Scenario:REG_DBP_06-Verify that eligible charts for that Channel state are displayed and refreshed when merchant changes Date Range, Currency, or Payment Status based on below criteria
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    And I select "Last 7 days" from "Date" filter
    Then I Verify Ecom Pie charts

  @Dashboard @test
  Scenario:REG_DBP_07-Verify that "Orders by Collection Status" Pie-Chart displays with correct share & hover details with Header Metrics & Drill-Down Trigger when merchant login to portal and navigate to dashboard page & Filter with below Condition

    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify "Orders by Collection Status" piechart
    And  I Verify "Orders by Collection Status" Breakdown
    When I select "Last 7 days" from "Date" filter
    And  I Verify "Orders by Collection Status" piechart
  @Dashboard
  Scenario:REG_DBP_08-Verify that "Orders by currency" Pie-Chart displays with correct share & hover details with Header Metrics & Drill-Down Trigger  when merchant login to portal and navigate to dashboard page & Filter with below Condition
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify "Orders by currency" piechart
    And  I Verify "Orders by currency" Breakdown
  @Dashboard
  Scenario:REG_DBP_09-Verify that "Orders by Shopper IP Country" Pie-Chart displays with correct share & hover details when merchant login to portal and navigate to dashboard page & Filter with below Condition
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify "Orders by Shopper IP Country" piechart
    And  I Verify "Orders by Shopper IP Country" Breakdown
  @Dashboard
  Scenario:REG_DBP_10-Verify that "Orders by Issuing Country" Pie-Chart displays with correct share & hover details with Header Metrics & Drill-Down Trigger when merchant login to portal and navigate to dashboard page & Filter with below Condition
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify "Orders by Issuing Country" piechart
    And  I Verify "Orders by Issuing Country" Breakdown
  @Dashboard
  Scenario:REG_DBP_11-Verify that "Orders by Shopper Type" Pie-Chart displays with correct share & hover details with Header Metrics & Drill-Down Trigger when merchant login to portal and navigate to dashboard page & Filter with below Condition
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify "Orders by Shopper Type" piechart
    And  I Verify "Orders by Shopper Type" Breakdown
  @Dashboard
  Scenario:REG_DBP_12-Verify that the Each Metric Cards values are refreshed with E-Com Channel
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    And I Verify Todays Value
    And I Verify Yesterday Value
  @Dashboard @logout
  Scenario:REG_DBP_13-Verify that the Each Metric Cards values are refreshed with SoftPOS Channel

    When I login using "attp" user name and password
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    And I Verify Todays Value
    And I Verify Yesterday Value

  @Dashboard@logout @PR
  Scenario:REG_DBP_14-Verify the Metric Cards [Total Volume Widget (Payment Amount)] is Calculated correctly_ECOMMERCE

    When I login using "mcp" user name and password

    And I click on Orders tab
    And I select today as the date range
    And I select "Successful" from "payment Status" filter
    Then I verify the total payments count and total payment value
    When I click on Summary tab
    And I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter

    And I Verify Todays Value


  @Dashboard @logout @PR
  Scenario:REG_DBP_15-Verify the Metric Cards [Total Volume Widget (Payment Amount)] is Calculated correctly_SOFT_POS
    When I login using "attp" user name and password
    And I click on Orders tab
    And I select today as the date range
    And I select "Successful" from "Payment Status" filter
    Then I verify the total payments count and total payment value
    When I click on Summary tab
    And I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    And I select "MOTO" from "channel" filter
    And I Verify Todays Value
  @Dashboard  @logout @PR
  Scenario:REG_DBP_16-Verify the Metric Cards [Payments Count Calculation] is Calculated correctly_Ecommerce
    When I login using "mcp" user name and password
    And I click on Orders tab
    And I select today as the date range
    And I select "Successful" from "Payment Status" filter
    Then I verify the total payments count and total payment value
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    And I Verify Todays Value


  @Dashboard @logout @PR
  Scenario:REG_DBP_17-Verify the Metric Cards [Payments Count Calculation] is Calculated correctly_SoftPOS

    When I login using "attp" user name and password
    And I click on Orders tab
    And I select today as the date range
    And I select "Successful" from "Payment Status" filter
    Then I verify the total payments count and total payment value
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    And I Verify Todays Value

  @Dashboard @logout @PR
  Scenario:REG_DBP_18-Verify the Metric Cards [Refunds Value Widget] is Calculated correctly

    When I login using "mcp" user name and password
    And I click on Orders tab
    And I select day before yesterday as the date range
    And I select "Successful" from "Payment Status" filter
    And I do the full Refund
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    And I Verify Todays Value

  @Dashboard @PR
  Scenario:REG_DBP_19-Verify the Metric Cards [Refunds Count Widget] is Calculated correctly
    When I click on Orders tab
    And I select day before yesterday as the date range
    And I select "Successful" from "Payment Status" filter
    And I do the full Refund
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    And I Verify Todays Value
  @Dashboard
  Scenario:REG_DBP_20-Verify that Total Payment Value (TPV) Graph : Channel Lines displays only Two lines (E-commerce = Red, SoftPOS = Green )

    When I Verify Defualt filter Data
    Then I verify the TPV graph colors

  @Dashboard @logout
  Scenario:REG_DBP_21-Verify the Hover Content for Total Payment Value (TPV) Graph_SoftPOS

    When I login using "attp" user name and password
    When I select "Today" from "Date" filter
    Then I verify the TPV graph hover content

  @Dashboard @logout
  Scenario:REG_DBP_22-Verify the Hover Content for Total Payment Value (TPV) Graph_E-Commerce

    When I login using "mcp" user name and password
    When I select "Today" from "Date" filter
    Then I verify the TPV graph hover content

  @Dashboard@logout @TPV
  Scenario:REG_DBP_23-Verify the Header Metrics & Drill-Down Trigger for Total Payment Value (TPV) Graph_SoftPos

    When I login using "attp" user name and password
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    Then I Verify Total Sales
    And I Verify "Average Transaction Value"
    And I Verify "Total transactions"

  @Dashboard@logout  @TPV
  Scenario:REG_DBP_24-Verify the Header Metrics & Drill-Down Trigger for Total Payment Value (TPV) Graph_E-Commerce

    When I login using "mcp" user name and password
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Total Sales
    And I Verify "Average Transaction Value"
    And I Verify "Total transactions"

  @Dashboard @logout  @TPV
  Scenario:REG_DBP_25-Verify the Header Metrics & Drill-Down Trigger for Total Payment Value (TPV) Graph_SoftPos

    When I login using "attp" user name and password
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    Then I Verify Total Sales
    And I Verify "Average Transaction Value"
    And I Verify "Total transactions"

  @Dashboard @logout  @TPV
  Scenario:REG_DBP_26-Verify the Header Metrics & Drill-Down Trigger for Total Payment Value (TPV) Graph_E-Commerce

    When I login using "mcp" user name and password
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Total Sales
    And I Verify "Average Transaction Value"
    And I Verify "Total transactions"

  @Dashboard
  Scenario:REG_DBP_27-Verify the Acceptance Rate Pie chart Rendering (Segments, Percentage Position, Hover Data)
    When I click on Summary tab
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify Acceptance rate piechart


  @Dashboard
  Scenario:REG_DBP_28-Verify that both pie charts (Acceptance Rate and Top 5 Decline Reasons) and any open drill-down
    When I click on Summary tab
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify Acceptance rate piechart
    And  I Verify Top 5 declines piechart

  @Dashboard
  Scenario:REG_DBP_29-Verify the Acceptance Rate Pie chart Drill-Down Trigger & should display one detailed item for the ECom channel
    When I click on Summary tab
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify Acceptance rate piechart
  @Dashboard @logout
  Scenario:REG_DBP_30-Verify the Acceptance Rate Pie chart Drill-Down Trigger & should display one detailed item for the SoftPOS channel

    When I login using "attp" user name and password
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify Acceptance rate piechart

  @Dashboard
  Scenario:REG_DBP_31-Verify that Pie-Chart displays top 5 decline Reasons_SoftPOS
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify Top 5 declines piechart

  @Dashboard
  Scenario:REG_DBP_32-Validate the Drill-down content for Pie-Chart displays top 5 decline Reasons_SoftPOS
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify Top 5 declines piechart

  @Dashboard @logout
  Scenario:REG_DBP_33-Verify that Pie-Chart displays top 5 decline Reasons_ECOMMERCE

    When I login using "mcp" user name and password
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify Top 5 declines piechart

  @Dashboard
  Scenario:REG_DBP_34-Validate the Drill-down content for Pie-Chart displays top 5 decline Reasons_ECOMMERCE
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify Top 5 declines piechart
  @Dashboard
  Scenario:REG_DBP_35-Verify that the Acceptance Rate Pie Chart is rendered & maintain the existing behavior
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify Acceptance rate piechart

  @Dashboard
  Scenario:REG_DBP_36-Verify that the Top 5 decline Reason Pie Chart is rendered & maintain the existing behavior
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "ECOMMERCE" from "channel" filter
    Then I Verify Ecom Pie charts
    And  I Verify Top 5 declines piechart