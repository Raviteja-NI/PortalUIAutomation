Feature: Verify the Summary Dashboard Page for POS and Mosambee

  Background:  Login as merchant user
    Given I navigate to the sandbox portal

  @Dashboard
  Scenario:DEP_DGR_005-Verify that the dashboard renders only the 3 pies & TPV graph when merchant admin login to portal and navigate to dashboard page select Channel as "POS"
    When I login using "carrefour" user name and password
    And I Verify Defualt filter Data
    And I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    When I select "POS" from "channel" filter
    Then I Verify Ecom Pie charts
  @Dashboard
  Scenario:DEP_DGR_010-Verify that eligible charts for that Channel state are displayed and refreshed

    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    When I select "POS" from "channel" filter
    And I select "Last 7 days" from "Date" filter
    Then I Verify Ecom Pie charts
    And I select "Last 14 days" from "Date" filter
    Then I Verify Ecom Pie charts
    And I select "Last 30 days" from "Date" filter
    Then I Verify Ecom Pie charts
  @Dashboard
  Scenario:DEP_DGR_019-Verify the Metric Cards [Total Volume Widget (Payment Amount)] is Calculated correctly_POS

    When I click on Orders tab
    And I click on Transactions tab
    And I select today as the date range
    And I select "Pos" from "Channel" filter
    And I select "Approved" from "Transaction Status" filter
    And I select "Authorised" from "Transaction Status" filter
    And I select "captured" from "Transaction Status" filter
    Then I verify the total payments count and total payment value
    When I click clear on the "Transaction Status" filter
    And I select "Refunded" from "Transaction Status" filter
    Then I verify the Total Refunds Value and Refunds count
    And I calculate the Total Value
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    When I select "POS" from "channel" filter
    And I Verify Todays Value

  @Dashboard @logout
  Scenario:DEP_DGR_020-Verify the Metric Cards [Total Volume Widget (Payment Amount)] is Calculated correctly_SoftPOS_Mosambee
    When I login using "mosambee" user name and password
    And I click on Orders tab
    And I click on Transactions tab
    And I select today as the date range
    And I select "Pos" from "Channel" filter
    And I select "Approved" from "Status" filter
    And I select "Authorised" from "Status" filter
    And I select "captured" from "Status" filter
    Then I verify the total payments count and total payment value
    When I click clear on the "Status" filter
    And I select "Refunded" from "Status" filter
    Then I verify the Total Refunds Value and Refunds count
    And I calculate the Total Value
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    When I select "SOFT_POS" from "channel" filter
    And I Verify Todays Value

  @Dashboard@logout
  Scenario:DEP_DGR_021-Verify the Metric Cards [Payments Count Calculation] is Calculated correctly_Pos
    When I login using "carrefour" user name and password
    And I click on Orders tab
    And I click on Transactions tab
    And I select today as the date range
    And I select "Pos" from "Channel" filter
    And I select "Approved" from "Status" filter
    And I select "Authorised" from "Status" filter
    And I select "captured" from "Status" filter
    Then I verify the total payments count and total payment value
    When I click clear on the "Status" filter
    And I select "Refunded" from "Status" filter
    Then I verify the Total Refunds Value and Refunds count
    And I calculate the Total Value
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    When I select "POS" from "channel" filter
    And I Verify Todays Value

  @Dashboard@logout
  Scenario:DEP_DGR_022-Verify the Metric Cards [Payments Count Calculation] is Calculated correctly_SoftPOS_Mosambee
    When I login using "mosambee" user name and password
    And I click on Orders tab
    And I click on Transactions tab
    And I select today as the date range
    And I select "Pos" from "Channel" filter
    And I select "Approved" from "Status" filter
    And I select "Authorised" from "Status" filter
    And I select "captured" from "Status" filter
    Then I verify the total payments count and total payment value
    When I click clear on the "Status" filter
    And I select "Refunded" from "Status" filter
    Then I verify the Total Refunds Value and Refunds count
    And I calculate the Total Value
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    And I Verify Todays Value

  @Dashboard@logout
  Scenario:DEP_DGR_023-Verify the Metric Cards [Refunds Value Widget] is Calculated correctly-POS
    When I login using "carrefour" user name and password
    And I click on Orders tab
    And I click on Transactions tab
    And I select today as the date range
    And I select "Refunded" from "Status" filter
    Then I verify the Total Refunds Value and Refunds count
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    And I select "POS" from "channel" filter
    And I Verify Todays Value
  @Dashboard@logout
  Scenario:DEP_DGR_024-Verify the Metric Cards [Refunds Value Widget] is Calculated correctly-SoftPOS_Mosambee
    When I login using "mosambee" user name and password
    And I click on Orders tab
    And I click on Transactions tab
    And I select today as the date range
    And I select "Refunded" from "Status" filter
    Then I verify the Total Refunds Value and Refunds count
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    And I Verify Todays Value
  @Dashboard@logout
  Scenario:DEP_DGR_025-Verify the Metric Cards [Refunds Count Widget] is Calculated correctly_POS
    When I login using "carrefour" user name and password
    And I click on Orders tab
    And I click on Transactions tab
    And I select today as the date range
    And I select "Refunded" from "Status" filter
    Then I verify the Total Refunds Value and Refunds count
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    And I select "POS" from "channel" filter
    And I Verify Todays Value
  @Dashboard@logout
  Scenario:DEP_DGR_026-Verify the Metric Cards [Refunds Count Widget] is Calculated correctly SOftPOS Mosambee
    When I login using "mosambee" user name and password
    And I click on Orders tab
    And I click on Transactions tab
    And I select today as the date range
    And I select "Refunded" from "Status" filter
    Then I verify the Total Refunds Value and Refunds count
    When I click on Summary tab
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    And I Verify Todays Value
  @Dashboard
  Scenario:DEP_DGR_029-Verify that Total Payment Value (TPV) Graph : Channel Lines displays only Two lines ( POS = Blue, SoftPOS = Green )
    When I Verify Defualt filter Data
    Then I verify the TPV graph colors
  @Dashboard
  Scenario:DEP_DGR_038-Verify the Header Metrics & Drill-Down Trigger for Total Payment Value (TPV) Graph_SoftPOS
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    Then I Verify Total Sales
    And I Verify "Average Transaction Value"
    And I Verify "Total transactions"
  @Dashboard @logout
  Scenario:DEP_DGR_039-Verify the Header Metrics & Drill-Down Trigger for Total Payment Value (TPV) Graph_POS

    When I login using "carrefour" user name and password
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "POS" from "channel" filter
    Then I Verify Total Sales
    And I Verify "Average Transaction Value"
    And I Verify "Total transactions"

  @Dashboard
  Scenario:DEP_DGR_040-Verify the Drill-Down: Selected Channels for Total Payment Value (TPV) Graph_Pos
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "POS" from "channel" filter
    Then I Verify Total Sales
    And I Verify "Average Transaction Value"
    And I Verify "Total transactions"


  @Dashboard @logout
  Scenario:DEP_DGR_041-Verify the Drill-Down: Selected Channels for Total Payment Value (TPV) Graph_SoftPos_Mosambee
    When I login using "mosambee" user name and password
    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    Then I Verify Total Sales
    And I Verify "Average Transaction Value"
    And I Verify "Total transactions"
  @Dashboard @logout
  Scenario:DEP_DGR_050-Verify the Acceptance Rate pie charts Drill-Down Trigger & should display one detailed item for the selected channel under each outlet- outlet_softPOS and POS
    When I login using "carrefour" user name and password
    And I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    And I select "POS" from "channel" filter
    Then  I Verify Acceptance rate piechart



  @Dashboard
  Scenario:DEP_DGR_051-Verify the Top 5 Decline Reasons pie charts Drill-Down Trigger & should display one detailed item for the selected channel under each outlet_softPOS and POS


    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    And I select "POS" from "channel" filter
    Then I Verify Top 5 declines piechart

  @Dashboard
  Scenario:DEP_DGR_053-Verify that each channel row display Accepted (count, %), Declined (count, %), Total (count) as  Per-Outlet summary row shows Accepted (count), Declined (count), Total (count) aggregated across that outlet’s channels _POS


    When I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "POS" from "channel" filter
    Then  I Verify Acceptance rate piechart

  @Dashboard @logout
  Scenario:DEP_DGR_054-Verify that each channel row display Accepted (count, %), Declined (count, %), Total (count) as  Per-Outlet summary row shows Accepted (count), Declined (count), Total (count) aggregated across that outlet’s channels_SOFTPOS
    When I login using "mosambee" user name and password
    And I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "SOFT_POS" from "channel" filter
    Then  I Verify Acceptance rate piechart
  @Dashboard @logout
  Scenario:DEP_DGR_056-Verify that Pie-Chart displays top 5 decline Reasons with correct Drill-down content details, when merchant login to portal and navigate to dashboard page with multiple channel (POS).
    When I login using "carrefour" user name and password
    And I select "Today" from "Date" filter
    When I click clear on the "channel" filter in Summary Page
    And I select "POS" from "channel" filter
    Then I Verify Top 5 declines piechart
