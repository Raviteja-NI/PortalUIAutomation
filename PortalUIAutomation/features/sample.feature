Feature: Summary Dashboard
  @sample
  Scenario: Verify Todays Activity section
    Given I am on the summary page
    Then I should see the "Total Value" and "Payments"  and "Refund"  and "Refund Amount" dashboards visible
    And the "Total Value" dashboard should be  Total Transactions
    
  