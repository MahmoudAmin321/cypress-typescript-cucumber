Feature: SUT - Dummy feature
        - Description for the feature

        References:
        - Domain terminologies -> https://github.com/Symbyo360/CourierWeb/wiki/Domain-Terminologies-For-BDD
        - BDD tags and statuses -> https://github.com/Symbyo360/CourierWeb/wiki/BDD-Tags-and-Statuses

        * [Scenarios_Defined_Partially] - Dummy rule
        * [Scenarios_Defined] - Loging with email and password should be validated
        * [Scenarios_Titles_Defined] - User session (refresh token) behavior should be as expected
        * [Scenarios_Defined_Partially] - Group of different individual scenarios
        * [Scenarios_Titles_Defined] - Visual scenarios


    Rule: Dummy rule
        @e2e
        Scenario: Dummy scenario
            Given Dummy step
            When You make dummy step as "aDmIn"
            When You make dummy step as "usEr1"
            When You make dummy step as "UseR2"
        @integration/comp
        Scenario Outline: Dummy scenario outline
            When Dummy step
            Examples:
                | header1   | header2   |
                | row1 col1 | row1 col2 |
                | row2 col1 | row2 col2 |

        @integration/program
        Scenario: Another dummy scenario