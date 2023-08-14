Feature: SUT - Products feature
        - Products feature description

        References:
        - BDD tags and statuses -> README.md

        Feature rules:
        * [Scenarios_Defined] - Products can be sorted
        * [Scenarios_Titles_Defined] - Products can be filtered
        * [Scenarios_Titles_Defined] - Conducted product changes by admin should reflect to the customer
        * [Scenarios_Titles_Defined] - Changed products display order can be reset to original
        * [Scenarios_Titles_Defined] - Group of individual scenarios


    Rule: Products can be sorted

        @program/bdd
        Scenario: Products can be sort by name in ascending order
            Given You have "home" page opened
            When You have "name (A-Z)" sort option selected
            Then Products should be sorted by "name" in "ascending" order

        @program/bdd
        Scenario: Products can be sort by name in descending order
            Given You have "home" page opened
            When You have "Name ( Z- a)" sort option selected
            Then Products should be sorted by "name" in "descending" order

        @program/bdd
        Scenario: Products can be sort by price in ascending order
            Given You have "home" page opened
            When You have "Price (ascending)" sort option selected
            Then Products should be sorted by "price" in "ascending" order

        @program/bdd
        Scenario: Products can be sort by price in descending order
            Given You have "home" page opened
            When You have "price (high - LOw)" sort option selected
            Then Products should be sorted by "price" in "descending" order

        @program/bdd
        Scenario: Switching sort (i.e. from ascending name to descending price) should work fine
            Given You have "home" page opened
            When You have "name (A-Z)" sort option selected
            When You have "price (high - LOw)" sort option selected
            Then Products should be sorted by "price" in "descending" order

        @program/bdd
        Scenario: Upon reseting sort, products order should be set back to original
            Given You have "home" page opened
            And You store products prices order
            When You have "Price (ascending)" sort option selected
            When You have "empty" sort option selected
            Then Products should be sorted by "none" in "original" order


    Rule: Products can be filtered

        @program/bdd
        Scenario: Products can be filtered by price range
            Given You have "home" page opened
            And You store products prices order
            And Product with price 12.01 "exists"
            When You have slider "left" button clicked
            And You hit "right arrow" key 12 times
            Then Slider "left" value is 13
            When You wait 3 seconds
            And You store products prices order
            Then Product with price 12.01 "not exists"

        @program/bdd
        Scenario: Products can be filtered by category
            Given You have "home" page opened
            And You store products names
            And Product with name "combination pliers" "exists"
            When You have "selected" "hand saw" category
            And You store products names
            Then Product with name "combination pliers" "not exists"
            Then 1. product is "wood saw"

        @todo
        Scenario: Products can be filtered by brand

        @program/bdd
        Scenario: Combining filters should be possible (Latest filter doesn't eliminate previous filter)
            Given You have "home" page opened
            And You have "selected" "hand saw" category
            And You store products names
            And Product with name "wood saw" "exists"
            When You have "selected" "Wrench" category
            Then Product with name "wood saw" "exists"
            When You store products names
            Then 2. product is "adjustable wrench"

        @program/bdd
        Scenario: Upon unselecting a filter, it should be eliminated and the products should be adjusted accordignly
            Given You have "home" page opened
            And You store products names
            And Product with name "combination pliers" "exists"
            And You have "selected" "hand saw" category
            And You store products names
            And Product with name "combination pliers" "not exists"
            When You have "unselected" "hand saw" category
            And You store products names
            Then Product with name "combination pliers" "exists"




    Rule: Conducted product changes by admin should reflect to the customer

        @program/bdd
        Scenario: When admin changes product details, the customer should see the new details

        @program/bdd
        Scenario: When admin changes product brand, the product should disappear from the old brand filteration and appear in the new


    Rule: Changed products display order can be reset to original

        @program/bdd
        Scenario: Clicking reset button should eliminate applied sort and filters and reset products order to original

        @program/bdd
        Scenario: Clicking reset button should eliminate applied search and reset products order to original


    Rule: Group of individual scenarios

        @program/suite
        Scenario:  A product card should have image, name and price

        @program/bdd
        Scenario: Products can be searched

        @program/bdd
        Scenario: Paginator should appear only if the products amount exceeds the max. amount a page can hold






