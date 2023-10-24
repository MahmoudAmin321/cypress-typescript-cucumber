Feature: SUT - Product feature
        - Product feature description

        References:
        - BDD tags and statuses -> README.md

        Feature rules:
        * [Scenarios_Titles_Defined] - Adding product to cart
        * [Scenarios_Titles_Defined] - Adding product to favourites
        * [Scenarios_Titles_Defined] - related products
        * [Scenarios_Defined] - Group of individual scenarios


    Rule: Adding product to cart

        @program/bdd
        Scenario: customer can increase or decrease the product quantity by clicking
        Given You programmatically login as "customer2"
        And You have "thor hammer" product opened from "customer" side
        When You increase quantity
        Then Quantity is "2"
        When You decrease quantity
        Then Quantity is "1"

        @program/bdd
        Scenario: customer cannot decrease the product quantity by clicking to less than 1
        Given You programmatically login as "customer2"
        And You have "thor hammer" product opened from "customer" side
        When You decrease quantity
        Then Quantity is "1"

        @program/bdd
        Scenario: customer can set the product quantity by inputting
        Given You programmatically login as "customer2"
        And You have "thor hammer" product opened from "customer" side
        When You set quantity to "25"
        Then Quantity is "25"

        @manual
        Scenario: There is No max. to quantity (inputting 999999999999998) is possible

        @program/bdd
        Scenario: quantity accepts only numbers
        Given You programmatically login as "customer2"
        And You have "thor hammer" product opened from "customer" side
        When You set quantity to "9a7b3C"
        Then Quantity is "973"

        @manual
        Scenario: quantity cannot be decimal

        @program/bdd
        Scenario: Trying to add product to cart with invalid (empty or 0 or -ve) quantity is Not possible
        Given You programmatically login as "customer2"
        And You have "thor hammer" product opened from "customer" side
        When You set quantity to " "
        And You add product to cart
        Then Success toaster "doesn't exist"
        And Cart icon "doesn't exist"
        When You set quantity to "0"
        And You add product to cart
        Then Success toaster "doesn't exist"
        And Cart icon "doesn't exist"
        When You set quantity to "-1"
        And You add product to cart
        Then Success toaster "doesn't exist"
        And Cart icon "doesn't exist"

        @program/bdd
        Scenario: upon adding product to cart, cart icon has correct quantity

        @program/bdd
        Scenario: upon adding product to cart, item gets added to cart with correct data (name, price, quantity, total)

        @program/bdd
        Scenario: ownership (added product by customerX doesn't get add to cart of customerY)


    Rule: Adding product to favourites

        @program/bdd
        Scenario: upon adding a product to favourites, success msg is displayed

        @program/bdd
        Scenario: upon adding a product to favourites, product gets added to favourites with correct data

        @program/bdd
        Scenario: adding product to favourites, while No user is logged in, is Not possible

        @program/bdd
        Scenario: increasing quantitiy plays No role in adding product to favourites

        @program/bdd
        Scenario: ownership (added product by customerX doesn't get add to favourites of customerY)


    Rule: related products

        @program/bdd
        Scenario: capactiy for displayed related products is 4

        @program/bdd
        Scenario: related products are of the same category of the current product

        @program/bdd
        Scenario: clicking on more information link redirects to the details page of the product


    Rule: Group of individual scenarios

        @program/bdd
        Scenario: Upon opening a product card, the product details (image, name and price) should be same as in card
            Given You programmatically login as "customer2"
            And You have "home" page opened
            When You store details of 1. card
            And You have 1. card opened
            Then Product details should be same as in card

        @program/bdd
        Scenario: When admin changes product details (name, category, brand, price, description), the customer should see the new details
            Given You programmatically login as "admin"
            And You have "products" page opened
            And You have "thor hammer" product opened from "admin" side
            When You set text field "name" of "edit product" page to "edited name"
            And You set dropdown "category" of "edit product" page to "Saw"
            And You set dropdown "brand" of "edit product" page to "Brand name 2"
            And You set text field "price" of "edit product" page to "9.13"
            And You set text field "description" of "edit product" page to "edited description"
            And You have saved
            And You have "edited name" product opened from "customer" side
            Then "Name" is "edited name"
            And "Category" is "Saw"
            And "Brand" is "Brand name 2"
            And "Price" is "9.13"
            And "Description" is "edited description" 

