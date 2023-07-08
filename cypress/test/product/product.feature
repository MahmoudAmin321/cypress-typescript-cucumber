Feature: SUT - Product feature
        - Product feature description

        References:
        - BDD tags and statuses -> README.md

        Feature rules:
        * [Scenarios_Defined] - Product details should be displayed correctly


    Rule: Product details should be displayed correctly

        @program/bdd
        Scenario: Upon opening a product card, the product details (image, name and price) should be same as in card
            Given You progrmmatically login as "customer1"
            And You have "home" page opened
            When You store details of 1. card
            And You open 1. card
            Then Product details should be same as in card

