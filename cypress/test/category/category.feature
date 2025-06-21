
Feature: SUT - Category feature
        - Category feature description

        References:
        - BDD tags and statuses -> README.md

        Feature rules:
        * [Scenarios_Titles_Defined] - user can create category (admin protal + effect on customer portal)
        * [Scenarios_Titles_Defined] - user can update category (admin protal + effect on customer portal)
        * [Scenarios_Titles_Defined] - user can delete category (admin protal + effect on customer portal)



    Rule: user can create category (admin protal + effect on customer portal)

        @program/bdd
        Scenario: creating a category with duplicate slug is Not possible
            Given You programmatically login as "admin"
            And You have "categories" page opened
            And You store "slug" of 1. "category"
            And "slug" of 1. "category" "is" " As sTored "
            When You have "add category" page opened
            And You set text field "name" of " add category" page to "cat name 1591258425"
            And You set text field "slug" of "add category " page to " aS stoRed "
            And You save
            Then "error" feedback "is displayed"
            And "error" feedback contain text " caTegory already exists with tHis Slug  "


        @program/bdd
        Scenario: creating a category with unique slug is possible
            Given You programmatically login as "admin"
            And You have "categories" page opened
            When You have "add category" page opened
            And You set text field "name" of " add category" page to "cat name 11111"
            And You set text field "slug" of "add category " page to "slug-11111"
            And You save
            Then " sUccesS " feedback "is displayed"
            And "success" feedback contain text " caTegory SaVeD  "


        @program/bdd
        Scenario: creating a category with duplicate name is possible
            Given You programmatically login as "admin"
            And You have "categories" page opened
            And You have "add category" page opened
            And You set text field "name" of " add category" page to "cat name 1234567"
            And You set text field "slug" of "add category " page to "slug-1234567"
            And You save
            And " sUccesS " feedback "is displayed"
            When You set text field "name" of " add category" page to "cat name 1234567"
            And You set text field "slug" of "add category " page to "diff-slug-1234567"
            And You save
            Then " sUccesS " feedback "is displayed"


        @program/bdd
        Scenario: created category gets appended to parent category DDL (admin portal)
            Given You programmatically login as "admin"
            And You have "categories" page opened
            And You have "add category" page opened
            And You set text field "name" of " add category" page to "cat name 12345615"
            And You set text field "slug" of "add category " page to "slug-12345615"
            And You save
            And " sUccesS " feedback "is displayed"
            And You have "categories" page opened
            And You have "add category" page opened
            Then option "cat name 12345615" exists


        @program/bdd
        Scenario: created category gets appended to categories list (admin portal)
            Given You programmatically login as "admin"
            When You have "add category" page opened
            And You set text field "name" of " add category" page to "cat name 123456568"
            And You set text field "slug" of "add category " page to "slug-123456568"
            And You save
            And " sUccesS " feedback "is displayed"
            And You have "categories" page opened
            And  You search for category "cat name 123456568"
            Then "Name" of 1. "category" is "cat name 123456568"


        @program/bdd
        Scenario: created parent category gets appended to categories filter as parent (customer portal)
            Given You programmatically login as "admin"
            When You have "add category" page opened
            And You set text field "name" of " add category" page to "cat name 123456560"
            And You set text field "slug" of "add category " page to "slug-123456560"
            And You save
            And " sUccesS " feedback "is displayed"
            And You have "home" page opened
            Then You find category "cat name 123456560" in parent categories

        @program/bdd @manual
        Scenario: created child category gets appended to categories filter as child (customer portal)



        # TODO
    Rule: user can update category (admin protal + effect on customer portal)

        @program/bdd
        Scenario: editing a category to duplicate slug is Not possible

        @program/bdd
        Scenario: editing a category to unique slug is possible

        @program/bdd
        Scenario: updated category name is displayed in parent category DDL (admin portal)

        @program/bdd
        Scenario: updated category data is displayed categories list (admin portal)

        @program/bdd
        Scenario: updated category name is displayed in categories filter (customer portal)

        @program/bdd
        Scenario: upon editing the parent category of a child category, the child category and its products move from old parent to new parent (customer portal)


    Rule: user can delete category (admin protal + effect on customer portal)

        @program/bdd
        Scenario: deleting an unused category is possible

        @program/bdd
        Scenario: deleting a used category is Not possible
