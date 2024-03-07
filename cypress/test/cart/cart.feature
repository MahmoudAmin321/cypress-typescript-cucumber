Feature: SUT - Cart feature
        - Cart feature description

        References:
        - BDD tags and statuses -> README.md

        Feature rules:
        * [Scenarios_Defined] - Added items to cart
        * [Scenarios_Titles_Defined] - Deleted items from cart
        * [Scenarios_Titles_Defined] - login step in checkout
        * [Scenarios_Titles_Defined] - Address step in checkout
        * [Scenarios_Titles_Defined] - payment step in checkout


    Rule: Added items to cart

        @program/bdd
        Scenario: Changing quantity affects amounts (unit price, item total, cart total) correctly
            # set up: set products unit price
            Given You programmatically login as "admin"
            When You have "products" page opened
            And You have "thor hammer" product opened from "admin" side
            And You set text field "price" of "edit product" page to "11.14"
            And You have saved
            When You have "products" page opened
            And You have "bolt cutters" product opened from "admin" side
            And You set text field "price" of "edit product" page to "48.41"
            And You have saved
            # add multi products
            Given You have "thor hammer" product opened from "customer" side
            And You add product to "cart"
            Given You have "bolt cutters" product opened from "customer" side
            And You add product to "cart"
            And You click on "cart" common button, which redirects to "cart" page
            # change quantity in cart
            When You set "quantity" of "thor hammer" to "3"
            # should Not affect unit price
            Then "Unit price" of "thor hammer" is "$11.14"
            # should affect item total price
            And "Total price" of "thor hammer" is "$33.42"
            # should affect cart total price
            And Cart total price is "$81.83"

        @program/bdd
        Scenario: ambiguous - Changing quantity affects cart icon correctly
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            And You set quantity to "3"
            When You add product to "cart"
            And "Cart" quantity is "3"
            And You click on "cart" common button, which redirects to "cart" page
            # change quantity in cart
            And You set "quantity" of "thor hammer" to "5"
            # should update Nr in cart icon correclty
            Then "Cart" quantity is "5"

        @manual @bug
        Scenario: bug - each logged in user has his own cart (ownership concept)


    Rule: Deleted items from cart

        @program/bdd
        Scenario: Deleting items from cart affects amounts (nr of rows in cart, cart total) correctly
        # add multi products to cart
        # delete one item from cart
        # should affect nr of rows in cart
        # should affect cart total price

        @program/bdd
        Scenario: Deleting items from cart affects cart icon correctly
        # add multi products to cart
        # delete one item from cart
        # should update Nr in cart icon correclty
        # delete all remaining items from cart
        # cart should be empty
        # cart icon should disappear


    Rule: login step in checkout

        @program/bdd
        Scenario: checkout cannot be completed without login
        # while No user is logged in, add item to cart
        # proceed
        # sign in step should display login fields
        # proceed btn should Not be displayed

        @program/bdd
        Scenario: upon login in cart, user can proceed to next checkout step

        @program/bdd
        Scenario: upon login before adding products to cart, checkout can continue without requiring user to login again


    Rule: Address step in checkout

        @program/bdd
        Scenario: address data are prefilled from user profile

        @program/bdd
        Scenario: checkout cannot continue wihout filling all mandatory address data

        @program/bdd
        Scenario: checkout can continue to next step upon filling all mandatory address data


    Rule: payment step in checkout

        @program/bdd
        Scenario: upon selecting bank transfer as payment method, the corresponding fields get displayed

        @program/bdd
        Scenario: upon selecting gift card as payment method, the corresponding fields get displayed

        @program/bdd
        Scenario: upon selecting payment method and confirming, payment is successful
