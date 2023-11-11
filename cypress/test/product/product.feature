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
        Scenario: Default product quantity is 1
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            Then "Product" quantity is "1"

        @program/bdd
        Scenario: customer can increase or decrease the product quantity by clicking
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            When You increase quantity
            Then "Product" quantity is "2"
            When You decrease quantity
            Then "Product" quantity is "1"

        @program/bdd
        Scenario: customer cannot decrease the product quantity by clicking to less than 1
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            When You decrease quantity
            Then "Product" quantity is "1"

        @program/bdd
        Scenario: customer can set the product quantity by inputting
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            When You set quantity to "25"
            Then "Product" quantity is "25"

        @manual
        Scenario: There is No max. to quantity (inputting 999999999999998) is possible

        @program/bdd
        Scenario: quantity accepts only numbers
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            When You set quantity to "9a7b3C"
            Then "Product" quantity is "973"

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

        @program/bdd @bug
        Scenario: bug - upon adding product to cart, cart icon has correct quantity
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            And Cart icon "doesn't exist"
            When You set quantity to "2"
            And You add product to cart
            Then Cart icon "exists"
            And "Cart" quantity is "2"
            When You have "CoMbination PlieRs" product opened from "customer" side
            Then Cart icon "exists"
            And "Cart" quantity is "2"
            When You add product to cart
            Then "Cart" quantity is "3"

        @program/bdd @bug
        Scenario: bug open mode - upon adding product to cart, item gets added to cart with correct data (name, price, quantity, total)
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            And You set quantity to "3"
            When You add product to cart
            And "Cart" quantity is "3"
            And You click on "cart" button, which redirects to "cart" page
            Then Row of item "thor hammer" "exists"
            And "Quantity" of "thor hammer" is "3"
            And "Unit price" of "thor hammer" is "$11.14"
            And "Total price" of "thor hammer" is "$33.42"

        @program/bdd @bug
        Scenario: bug open mode - upon adding further product to cart, the total of this further product is added to the cart total
            Given You programmatically login as "customer2"
            And You have "thor hammer" product opened from "customer" side
            And You set quantity to "3"
            And You add product to cart
            And "Cart" quantity is "3"
            And You click on "cart" button, which redirects to "cart" page
            And Row of item "thor hammer" "exists"
            And "Total price" of "thor hammer" is "$33.42"
            And Cart total price is "$33.42"
            And You have "slip joint pliers" product opened from "customer" side
            And You set quantity to "2"
            When You add product to cart
            Then "Cart" quantity is "5"
            When You click on "cart" button, which redirects to "cart" page
            Then Row of item "slip joint pliers" "exists"
            And "Total price" of "slip joint pliers" is "$18.34"
            And Cart total price is "$51.76"

        @program/bdd @bug
        Scenario: bug - ownership (added product by customerX doesn't get add to cart of customerY)


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
            Given You programmatically prepare brands data
            And You programmatically login as "admin"
            And You have "products" page opened
            And You have "thor hammer" product opened from "admin" side
            When You set text field "name" of "edit product" page to "ttthor hammer edited name"
            And You set dropdown "category" of "edit product" page to "Saw"
            And You set dropdown "brand" of "edit product" page to "Brand name 2"
            And You set text field "price" of "edit product" page to "9.13"
            And You set text field "description" of "edit product" page to "edited description"
            And You have saved
            And You have "ttthor hammer edited name" product opened from "customer" side
            Then "Name" is "ttthor hammer edited name"
            And "Category" is "Saw"
            And "Brand" is "Brand name 2"
            And "Price" is "9.13"
            And "Description" is "edited description"
            # Tear down: Reset name, category, brand, price
            When You have "products" page opened
            And You have "ttthor hammer edited name" product opened from "admin" side
            And You set text field "name" of "edit product" page to "Thor Hammer"
            And You set dropdown "category" of "edit product" page to "Hammer"
            And You set dropdown "brand" of "edit product" page to "Brand name 1"
            And You set text field "price" of "edit product" page to "11.13"
            And You have saved
            And You have "thor hammer" product opened from "customer" side
            Then "Name" is "Thor Hammer"
            And "category" is "hammer"
            And "brand" is "brand name 1"
