Feature: SUT - Products feature
        - Products feature description

        References:
        - BDD tags and statuses -> README.md

        Feature rules:
        * [Scenarios_Defined] - Products can be sorted
        * [Scenarios_Defined] - Products can be filtered
        * [Scenarios_Defined] - Conducted product changes by admin should reflect to the customer
        * [Scenarios_Defined] - Changed products display order can be reset to original
        * [Scenarios_Defined] - Group of individual scenarios


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
        Scenario: investigate later [Fails upon running all tests] - Products can be filtered by price range
            Given You have "home" page opened
            And You store products prices order
            And Product with price 12.01 "is included"
            When You have slider "left" button clicked
            And You hit "right arrow" key 12 times
            Then Slider "left" value is 13
            When You wait 3 seconds
            And You store products prices order
            Then Product with price 12.01 "is not included"

        @program/bdd
        Scenario: Products can be filtered by category
            Given You have "home" page opened
            And You store products names
            And Product with name "combination pliers" "is included"
            When You have "selected" "hand saw" category
            And You store products names
            Then Product with name "combination pliers" "not included"
            Then 1. product "is" "wood saw"

        @todo
        Scenario: Products can be filtered by brand

        @program/bdd
        Scenario: Combining filters should be possible (Latest filter doesn't eliminate previous filter)
            Given You have "home" page opened
            And You have "selected" "hand saw" category
            And You store products names
            And Product with name "wood saw" "included"
            When You have "selected" "Wrench" category
            Then Product with name "wood saw" "included"
            When You store products names
            Then 2. product "is" "adjustable wrench"

        @program/bdd
        Scenario: Upon unselecting a filter, it should be eliminated and the products should be adjusted accordignly
            Given You have "home" page opened
            And You store products names
            And Product with name "combination pliers" "included"
            And You have "selected" "hand saw" category
            And You store products names
            And Product with name "combination pliers" "not included"
            When You have "unselected" "hand saw" category
            And You store products names
            Then Product with name "combination pliers" "included"


    Rule: Conducted product changes by admin should reflect to the customer

        @e2e
        Scenario: When admin changes product details, the customer should see the new details
            Given You login as "admin"
            And You "expand" "navigation" menu, if needed
            And You "expand" "user" menu
            And You click on "products" button, which redirects to "products" page
            When You have clicked on "edit" button of 5. "product"
            And You set text field "name" of "edit product" page to "edited name"
            And You set text field "price" of "edit product" page to "9.13"
            And You have saved
            And You have "products" page opened
            Then "name" of 5. "product" "is" "edited name"
            When You have "home" page opened
            And You store products names
            And You store products prices order
            Then Product with name "edited name" "included"
            And Product with price 9.13 "is included"

        @program/bdd
        Scenario: When admin changes product brand, the product should disappear from the old brand filteration and appear in the new
            Given You programmatically login as "admin"
            And You have "products" page opened
            And "name" of 3. "product" is "Bolt Cutters"
            Given You have "home" page opened
            And You have "selected" "brand name 1" brand
            And You store products names
            And Product with name "bolt cutters" "included"
            And You have "products" page opened
            When You have clicked on "edit" button of 3. "product"
            And You set dropdown "brand" of "edit product" page to "Brand name 2"
            And You have saved
            And You have "home" page opened
            And You have "selected" "brand name 1" brand
            And You store products names
            Then Product with name "bolt cutters" "not included"
            When You have "unselected" "brand name 1" brand
            And You have "selected" "brand name 2" brand
            And You store products names
            Then Product with name "bolt cutters" "included"
            #Tear down: reset brand
            When You have "products" page opened
            And You have "bolt cutters" product opened from "admin" side
            And You set dropdown "brand" of "edit product" page to "Brand name 1"
            And You have saved
            And You have "bolt cutters" product opened from "customer" side
            Then "Brand" is "Brand name 1"


    Rule: Changed products display order can be reset to original

        @program/bdd
        Scenario: Clicking reset button should eliminate applied sort and filters and reset products order to original
            Given You have "home" page opened
            And You store products names
            And Product with name "combination pliers" "included"
            And You have "Name ( Z- a)" sort option selected
            And You have "selected" "Hammer" category
            And You store products names
            And Product with name "combination pliers" "not included"
            And 1. product "is" "Thor Hammer"
            When You have reset
            And You store products names
            Then Product with name "combination pliers" "included"

        @program/bdd
        Scenario: Clicking reset button should eliminate applied search and reset products order to original
            Given You have "home" page opened
            And You store products names
            And Product with name "combination pliers" "included"
            And You have searched for "hammer"
            And You store products names
            And Product with name "combination pliers" "not included"
            When You have reset
            And You store products names
            Then Product with name "combination pliers" "included"


    Rule: Group of individual scenarios

        @program/suite
        Scenario:  A product card should have image, name and price

        @program/bdd
        Scenario: Products can be searched
            Given You have "home" page opened
            And You store products names
            And 1. product "is" "combination pliers"
            When You have searched for "hammer"
            And You store products names
            Then Product with name "combination pliers" "not included"
            And 1. product "contains" "hammer"

        @program/bdd
        Scenario: Paginator should appear only if the products amount exceeds the max. amount a page can hold
            When You have "home" page opened
            Then Paginator "is visible"
            When You have searched for "combination"
            And Displayed products are less than maximum
            Then Paginator "doesn't exist"
