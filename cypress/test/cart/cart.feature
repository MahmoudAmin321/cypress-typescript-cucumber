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
        Scenario: bug - Changing quantity affects amounts (unit price, item total, cart total) correctly
            # set up: set products unit price
            Given You programmatically login as "admin"
            When You have "products" page opened
            And You have "thor hammer" product opened from "admin" side
            And You set text field "price" of "edit product" page to "11.14"
            And You set text field "stock" of "edit product" page to "25"
            And You have saved
            When You have "products" page opened
            And You have "bolt cutters" product opened from "admin" side
            And You set text field "price" of "edit product" page to "48.41"
            And You set text field "stock" of "edit product" page to "25"
            And You have saved
            # add multi products
            Given You have "thor hammer" product opened from "customer" side
            And You have added product to "cart"
            Given You have "bolt cutters" product opened from "customer" side
            And You have added product to "cart"
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
        Scenario: Changing quantity affects cart icon correctly
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            And You set quantity to "3"
            When You have added product to "cart"
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
        Scenario: bug - Deleting items from cart affects amounts (cart rows and total) correctly
            # set up: set products unit price
            Given You programmatically login as "admin"
            When You have "products" page opened
            And You have "thor hammer" product opened from "admin" side
            And You set text field "price" of "edit product" page to "11.14"
            And You set text field "stock" of "edit product" page to "25"
            And You have saved
            When You have "products" page opened
            And You have "bolt cutters" product opened from "admin" side
            And You set text field "price" of "edit product" page to "48.41"
            And You set text field "stock" of "edit product" page to "25"
            And You have saved
            # add multi products
            Given You have "thor hammer" product opened from "customer" side
            And You have added product to "cart"
            Given You have "bolt cutters" product opened from "customer" side
            And You have added product to "cart"
            And You click on "cart" common button, which redirects to "cart" page
            And Item "thor hammer" of "cart" page "exists"
            And Item "bolt cutters" of "cart" page "exists"
            # intitial cart total price
            And Cart total price is "$59.55"
            # delete one item from cart
            When You have "deleted" "thor hammer" from cart
            # should affect cart rows
            Then Item "thor hammer" of "cart" page "doesn't exist"
            And Item "bolt cutters" of "cart" page "exists"
            # should affect cart total price
            And Cart total price is "$48.41"
            # teardown: make cart empty
            When You have "deleted" "bolt cutters" from cart
            Then Cart total price is "$0.00"

        @program/bdd
        Scenario: bug - Deleting items from cart affects cart icon correctly
            # set up: set products unit price
            Given You programmatically login as "admin"
            When You have "products" page opened
            And You have "thor hammer" product opened from "admin" side
            And You set text field "price" of "edit product" page to "11.14"
            And You set text field "stock" of "edit product" page to "25"
            And You have saved
            Given You have "products" page opened
            And You have "bolt cutters" product opened from "admin" side
            And You set text field "price" of "edit product" page to "48.41"
            And You set text field "stock" of "edit product" page to "25"
            And You have saved
            # add multi products
            Given You have "thor hammer" product opened from "customer" side
            And You have added product to "cart"
            Given You have "bolt cutters" product opened from "customer" side
            And You have added product to "cart"
            And Cart icon "exists"
            And "Cart" quantity is "2"
            And You click on "cart" common button, which redirects to "cart" page
            # delete one item from cart
            When You have "deleted" "thor hammer" from cart
            # should update Nr in cart icon correclty
            Then "Cart" quantity is "1"
            # delete all remaining items from cart
            When You have "deleted" "bolt cutters" from cart
            # cart should be empty
            Then Item "thor hammer" of "cart" page "doesn't exist"
            Then Item "bolt cutters" of "cart" page "doesNot exist"
            And Cart total price is "$0.00"
            # cart icon should disappear
            And Cart icon "doesNot exist"


    Rule: login step in checkout

        @program/bdd
        Scenario: checkout cannot be completed without login
            Given You have "thor hammer" product opened from "customer" side
            And You have added product to "cart"
            And You click on "cart" common button, which redirects to "cart" page
            When You click on proceed button of "cart" step
            Then "sign in" step "is displayed"
            And proceed button of "sign in" step "doesn't exist"

        @program/bdd
        Scenario: upon login in cart, user can proceed to next checkout step
            Given You have "thor hammer" product opened from "customer" side
            And You have added product to "cart"
            And You click on "cart" common button, which redirects to "cart" page
            And You click on proceed button of "cart" step
            And "sign in" step "is displayed"
            When You login in cart as "customer2"
            Then proceed button of "sign-in" step "exists"
            When You click on proceed button of "Sign - in" step
            Then "address" step "is displayed"

        @program/bdd
        Scenario: upon login before adding products to cart, checkout can continue without requiring user to login again
            When You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            And You have added product to "cart"
            And You click on "cart" common button, which redirects to "cart" page
            And You click on proceed button of "cart" step
            And proceed button of "sign-in" step "exists"
            Then "sign in" step "includes" text "you are already logged in"
            When You click on proceed button of "Sign - in" step
            Then "address" step "is displayed"


    Rule: Address step in checkout

        @program/bdd
        Scenario: address data are prefilled from user profile
            Given You programmatically login as "customer2"
            # set address data in user profile
            And You have "my profile" page opened
            And You set "profile" "address" field to "Ttest street 125"
            And You set "profile" "city" field to "t city"
            And You set "profile" "state" field to ""
            And You set "profile" "country" field to "t country"
            And You set "profile" "postal code" field to ""
            And You have updated user profile
            # go to address step in cart
            When You have "thor hammer" product opened from "customer" side
            And You have added product to "cart"
            And You click on "cart" common button, which redirects to "cart" page
            And You click on proceed button of "cart" step
            And "sign in" step "is visible"
            And You click on proceed button of "sign in" step
            And "address" step "is visible"
            # expected result
            Then "checkout" "address" field value is "Ttest street 125"
            And "checkout" "city" field value is "t city"
            And "checkout" "state" field value is ""
            And "checkout" "country" field value is "t country"
            And "checkout" "postal code" field value is ""

        @program/bdd
        Scenario: checkout cannot continue wihout filling all mandatory address data
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            And You have added product to "cart"
            And You click on "cart" common button, which redirects to "cart" page
            And You click on proceed button of "cart" step
            And "sign in" step "is visible"
            And You click on proceed button of "sign in" step
            And "address" step "is visible"
            When You set "checkout" "address" field to ""
            Then proceed button of "address" step "is disabled"


        @program/bdd
        Scenario: checkout can continue to next step upon filling all mandatory address data
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            And You have added product to "cart"
            And You click on "cart" common button, which redirects to "cart" page
            And You click on proceed button of "cart" step
            And "sign in" step "is visible"
            And You click on proceed button of "sign in" step
            And "address" step "is visible"
            When You set "checkout" "address" field to "test address test"
            When You set "checkout" "city" field to "test city test"
            And You set "checkout" "state" field to "test state test"
            And You set "checkout" "country" field to "test country test"
            And You set "checkout" "postal code" field to "123789"
            Then proceed button of "address" step "is enabled"
            When  You click on proceed button of "address" step
            Then "payment" step "is displayed"


    Rule: payment step in checkout

        @program/bdd
        Scenario: upon selecting bank transfer as payment method, the corresponding fields get displayed
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            And You have added product to "cart"
            And You click on "cart" common button, which redirects to "cart" page
            And You click on proceed button of "cart" step
            And "sign in" step "is visible"
            And You click on proceed button of "sign in" step
            And "address" step "is visible"
            And You set "checkout" "state" field to "test state test"
            And You set "checkout" "postal code" field to "123789"
            And proceed button of "address" step "is enabled"
            And  You click on proceed button of "address" step
            And "payment" step "is displayed"
            When "bank transfer" payment method "Not selected"
            Then in payment step, "bank name" field "doesN't exist"
            And in payment step, "account name" field "doesN't exist"
            And in payment step, "account nr" field "doesN't exist"
            When You have "bank transfer" payment method selected
            Then in payment step, "bank name" field "exists"
            And in payment step, "account name" field "exists"
            And in payment step, "account number" field "exists"

        @program/bdd
        Scenario: upon selecting gift card as payment method, the corresponding fields get displayed
        Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            And You have added product to "cart"
            And You click on "cart" common button, which redirects to "cart" page
            And You click on proceed button of "cart" step
            And "sign in" step "is visible"
            And You click on proceed button of "sign in" step
            And "address" step "is visible"
            And You set "checkout" "state" field to "test state test"
            And You set "checkout" "postal code" field to "123789"
            And proceed button of "address" step "is enabled"
            And  You click on proceed button of "address" step
            And "payment" step "is displayed"
            When "gift card" payment method "Not selected"
            Then in payment step, "gift card nr" field "doesN't exist"
            And in payment step, "validation code" field "doesN't exist"
            When You have "gift card" payment method selected
            Then in payment step, "gift card nr" field "exists"
            And in payment step, "validation code" field "exists"
            
        @program/bdd
        Scenario: upon selecting payment method and confirming, payment is successful
        #TODO