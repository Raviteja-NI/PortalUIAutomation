Feature: Verify the Transactions Listings Scenarios -POS,Softpos ATTP and Mosambee

    Background:  Login as merchant user
        Given I navigate to the sandbox portal


    @f
    Scenario: Verify Filters in Transactions page
        When I login using "carrefour" user name and password
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "AED" from "currency" filter
        And I select "pos" from "channel" filter
        And I select "Refunded" from "status" filter


   @Transactions
    Scenario: DEP_TNLS_013-"Verify that Merchant is able to view a comprehensive list of all transactions in Merchant Portal with an unified view of all transactions for easier management,Transaction Type: Purchase and Channel:POS
        When I login using "carrefour" user name and password
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        Then I Verify filtered channel
   @Transactions
    Scenario: DEP_TNLS_016-"Verify that Merchant is able to view a comprehensive list of all transactions in Merchant Portal with an unified view of all transactions for easier management Outlet Name as AAAAAA and channel as POS"
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Carrefour Online UAE" from "Outlet" filter
        Then I Verify filtered channel
   @Transactions
    Scenario: DEP_TNLS_017-"Verify that Merchant is able to view a comprehensive list of all transactions in Merchant Portal with an unified view of all transactions for easier management,Transaction Date: DD-MM-YYYY and Channel:  POS
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Carrefour Online UAE" from "Outlet" filter
        Then I Verify filtered channel

   @Transactions
    Scenario: DEP_TNLS_022-"Verify that Merchant is able to view a comprehensive list of all transactions in Merchant Portal with an unified view of all transactions for easier management and Transaction Type: Normal purchase and Channel:  SoftPOS (ATTP/Mosambee)

        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Purchase" from "Type" filter
        Then I Verify filtered channel
   @Transactions
    Scenario: DEP_TNLS_028-Verify that  Portal user is able to filter transactions in Unified Transactions View based on the various criteria as per below filter matrix, Date as Last 7 days and Pos & SoftPOS (ATTP/Mosambee)
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 7 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        Then I Verify filtered channel

    Scenario: DEP_TNLS_029-Verify that  Portal user is able to filter transactions in Unified Transactions View based on the various criteria as per below filter matrix- Date as Last 7 days and Pos & SoftPOS (ATTP/Mosambee)
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 14 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        Then I Verify filtered channel
    Scenario: DEP_TNLS_030-Verify that  Portal user is able to filter transactions in Unified Transactions View based on the various criteria as per below filter matrix  Date as Last 30 days and Pos & SoftPOS (ATTP/Mosambee)
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        Then I Verify filtered channel
   @Transactions
    Scenario: DEP_TNLS_047-Verify that Merchant admin is able to filter transactions in Unified Transactions View based on the various criteria as per below filter matrix-paymentMethod-MASTERCARD and Pos & SoftPOS (ATTP/Mosambee)
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Mastercard" from "Payment Method" filter
        Then I Verify filtered channel
   @Transactions
    Scenario: DEP_TNLS_049-Verify that Merchant admin is able to filter transactions in Unified Transactions View based on the various criteria as per below filter matrix.
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Visa" from "Payment Method" filter
        Then I Verify filtered channel
   @Transactions
    Scenario: DEP_TNLS_084-Verify that  the Apply button is disabled and an inline hint explains whats missing when user selects a searchField and enters a searchValue & click on Apply to filter transactions in Unified Transactions View based on the various criteria as per below filter matrix.-paymentMethod-VISA and Pos & SoftPOS (ATTP/Mosambee)
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "AUTH CODE" from "Search field" filter
        When I enter "authcode" from search field
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_086-Verify that  the Apply button is disabled and an inline hint explains whats missing when user selects a searchField and enters a searchValue & click on Apply to filter transactions in Unified Transactions View based on the various criteria as per below filter matrix--SoftPOS and searchField : APPIUmPayment ID
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "APM PAYMENT ID" from "Search field" filter
        When I enter "apmpaymentid" from search field
        Then I verify the number of transactions found
   @Transactions @logout
    Scenario: DEP_TNLS_095-Verify that  the Apply button is disabled and an inline hint explains whats missing when user selects a searchField and enters a searchValue & click on Apply to filter transactions in Unified Transactions View based on the various criteria as per below filter matrix--SoftPOS and searchField : Mechant ID
        When I login using "attp" user name and password
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "MID" from "Search field" filter
        When I enter "MID" from search field
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_096-Verify that  the Apply button is disabled and an inline hint explains whats missing when user selects a searchField and enters a searchValue & click on Apply to filter transactions in Unified Transactions View based on the various criteria as per below filter matri-SoftPOS and searchField : Terminal ID
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "TID" from "Search field" filter
        When I enter "TID" from search field
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_097-Verify that  the Apply button is disabled and an inline hint explains whats missing when user selects a searchField and enters a searchValue & click on Apply to filter transactions in Unified Transactions View based on the various criteria as per below filter matri-SoftPOS and searchField :CARD LAST4
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "CARD LAST4" from "Search field" filter
        When I enter "cardlast4" from search field
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_098-Verify that  the Apply button is disabled and an inline hint explains whats missing when user selects a searchField and enters a searchValue & click on Apply to filter transactions in Unified Transactions View based on the various criteria as per below filter matri-SoftPOS and searchField : RRN
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "RRN" from "Search field" filter
        When I enter "rrn" from search field
        Then I verify the number of transactions found
   @Transactions @logout
    Scenario: DEP_TNLS_111-Verify that Decline Reason Field displays appropriate Declined Reason Status in transaction detail page for channel as "POS".
        When I login using "carrefour" user name and password
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "AUTH CODE" from "Search field" filter
        When I enter "declinedauth" from search field
        And I click on the first transaction and display its details
        Then I display the transaction details section
   @Transactions
    Scenario: DEP_TNLS_114-Verify that the Card Type field will not display with value as "CREDIT" or "Debit" based on the card used for the transaction in transaction detail page for channel as "POS"
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I click on the first transaction and display its details
        And I expand cardholder details
        Then I display all cardholder fields
   @Transactions
    Scenario: DEP_TNLS_115-"Verify that the Payment Method shows the final method used with value as Cardbased, AliPay, Tamara in transaction detail page for channel as ""POS"
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "AED" from "currency" filter
        And I select "pos" from "channel" filter
        And I select "Refunded" from "status" filter
   @Transactions
    Scenario: DEP_TNLS_116-Verify that Merchant ID and Terminal ID field is displayed in transaction detail page for channel as "POS".
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I click on the first transaction and display its details
        And I expand merchant details
        Then I display all merchant fields
   @Transactions
    Scenario: DEP_TNLS_117-Verify that Card Scheme, Card Type, Masked PAN and Card Entry Method field is displayed with value as Contactless(tap), magstrip(swipe), chip, tokenized in transaction detail page for channel as "POS".
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I click on the first transaction and display its details
        And I expand cardholder details
        Then I display all cardholder fields
   @Transactions
    Scenario: DEP_TNLS_122-Verify that  Amount (signed, currency) is displayed in transaction detail page for channel as "POS".
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I click on the first transaction and display its details
        And I expand cardholder details
        Then I display all cardholder fields
   @Transactions
    Scenario: DEP_TNLS_123-Verify that Original Amount & currency, DCC amount are shown sidebyside when DCC transactions is performed which includes DCC amount next to original amount in transaction detail page for channel as "POS".
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I click on the first transaction and display its details
        And I expand cardholder details
        Then I display all cardholder fields
   @Transactions
    Scenario: DEP_TNLS_131-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and AMEX and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "American express" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_132-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and Dinersclub and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Diners club international" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_133-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and JAYWAN and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Jaywan" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_134-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and CHINA_UNION_PAY and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "China Union pay" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_135-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and MASTERCARD and PURCHASE transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Mastercard" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_136-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and JCB and PURCHASE transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "JCB" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_137-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and VISA and and PURCHASE transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Visa" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_138-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and RUPAY and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Rupay" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_139-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and MERCURY_RTA_NOL_CARD and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Mercury rta nol card" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_141-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and AL_ANSARI_DIGITAL_WALLET and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "AL ansari digital wallet" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_142-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and NPCI and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Aani" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_143-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and WECHAT_PAY and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Npci" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_144-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and TABBY and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Wechat pay" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_145-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and TAMARA and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "tabby" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_146-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and TERRA_PAY and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Tamara" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_147-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and ALIPAY and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Terra pay" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_148-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and XLS_REDEMPTION and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Alipay" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_149-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and MASTERCARD/VISA and  ABCB Touchpoints transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Xls Redemption" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_155-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and MC/VISA and  ABCB Touchpoints Reversal transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Mastercard" from "Payment Method" filter
        And I select "Visa" from "Payment Method" filter
        And I select "Adcb touchpoints" from "Type" filter
        Then I verify the number of transactions found
   @Transactions
    Scenario: DEP_TNLS_156-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and AANI and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "pos" from "channel" filter
        And I select "Mastercard" from "Payment Method" filter
        And I select "Visa" from "Payment Method" filter
        And I select "Adcb touchpoints reversal" from "Type" filter
        Then I verify the number of transactions found
   @Transactions @logout
    Scenario: DEP_TNLS_159-Verify that Transaction Status, Date/Time, RRN (10–12), Transaction Type, and Authorization Code dispWhen  I click on Orders tab
        When I login using "attp" user name and password
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I click on the first transaction and display its details
        And I expand cardholder details
        Then I display all cardholder fieldslayed in transaction detail page when merchant open the page for Approved transaction-softPOS

   @Transactions
    Scenario: DEP_TNLS_160-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and AANI and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "AUTH CODE" from "Search field" filter
        When I enter "declinedauth" from search field
        And I click on the first transaction and display its details
        Then I display the transaction details section
   @Transactions
    Scenario: DEP_TNLS_163-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and AANI and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I click on the first transaction and display its details
        And I expand cardholder details
        Then I display all cardholder fields
   @Transactions
    Scenario: DEP_TNLS_165-Verify that the Portal user is able to view the details of a transaction so that its can track the progress and outcome of each transaction-POS and AANI and and any transaction
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I click on the first transaction and display its details
        And I expand merchant details
        Then I display all merchant fields
   @Transactions
    Scenario: DEP_TNLS_166-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I click on the first transaction and display its details
        And I expand merchant details
        Then I display all merchant fields
   @Transactions
    Scenario: DEP_TNLS_167-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I click on the first transaction and display its details
        And I expand merchant details
        Then I display all merchant fields
   @Transactions
    Scenario: DEP_TNLS_171-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Declined" from "Status" filter
        Then I verify the number of transactions found
        And I display the transaction details section
   @Transactions
    Scenario: DEP_TNLS_174-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Mastercard" from "Payment Method" filter
        And I select "Visa" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
        And I display the transaction details section
   @Transactions
    Scenario: DEP_TNLS_175-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Mastercard" from "Payment Method" filter
        And I select "Visa" from "Payment Method" filter
        And I select "Purchase Reversal" from "Type" filter
        Then I verify the number of transactions found
        And I display the transaction details section
   @Transactions
    Scenario: DEP_TNLS_176-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Mastercard" from "Payment Method" filter
        And I select "Visa" from "Payment Method" filter
        And I select "Refund" from "Type" filter
        Then I verify the number of transactions found
        And I display the transaction details section
   @Transactions
    Scenario: DEP_TNLS_178-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Mastercard" from "Payment Method" filter
        And I select "Visa" from "Payment Method" filter
        And I select "Partial Refund" from "Type" filter
        Then I verify the number of transactions found
        And I display the transaction details section
   @Transactions @logout
    Scenario: DEP_TNLS_180-
        When I login using "mosambee" user name and password
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Declined" from "Status" filter
        Then I verify the number of transactions found
        And I display the transaction details section
   @Transactions
    Scenario: DEP_TNLS_186-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Declined" from "Status" filter
        Then I verify the number of transactions found
        And I display the transaction details section
        And I expand merchant details
        Then I display all merchant fields
   @Transactions
    Scenario: DEP_TNLS_187-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Declined" from "Status" filter
        Then I verify the number of transactions found
        And I display the transaction details section
   @Transactions
    Scenario: DEP_TNLS_188-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Declined" from "Status" filter
        Then I verify the number of transactions found
        And I display the transaction details section
   @Transactions
    Scenario: DEP_TNLS_194-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Mastercard" from "Payment Method" filter
        And I select "Visa" from "Payment Method" filter
        And I select "Purchase" from "Type" filter
        Then I verify the number of transactions found
        And I display the transaction details section
   @Transactions
    Scenario: DEP_TNLS_196-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Mastercard" from "Payment Method" filter
        And I select "Visa" from "Payment Method" filter
        And I select "Purchase Reversal" from "Type" filter
        Then I verify the number of transactions found
        And I display the transaction details section
   @Transactions
    Scenario: DEP_TNLS_197-
        When  I click on Orders tab
        And I click on Transactions tab
        And I select "Last 30 days" from "Date" filter
        And I select "soft pos" from "channel" filter
        And I select "Mastercard" from "Payment Method" filter
        And I select "Visa" from "Payment Method" filter
        And I select "Refund" from "Type" filter
        Then I verify the number of transactions found
        And I display the transaction details section
