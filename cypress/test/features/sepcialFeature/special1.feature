Feature: SUT - Special1 feature
        - Description for the feature

        References:
        - Domain terminologies -> https://github.com/Symbyo360/CourierWeb/wiki/Domain-Terminologies-For-BDD
        - BDD tags and statuses -> https://github.com/Symbyo360/CourierWeb/wiki/BDD-Tags-and-Statuses

        * [Scenarios_Defined_Partially] - Dummy rule
        * [Scenarios_Defined] - Loging with email and password should be validated
        * [Scenarios_Titles_Defined] - User session (refresh token) behavior should be as expected
        * [Scenarios_Defined_Partially] - Group of different individual scenarios
        * [Scenarios_Titles_Defined] - Visual scenarios


    Rule: Special1 Dummy rule
        @e2e
        Scenario: Special1 Dummy scenario
            Given Special1 Dummy step
        @integration/components
        Scenario Outline: Special1 Dummy scenario outline
            When Special1 Dummy step
            Examples:
                | header1   | header2   |
                | row1 col1 | row1 col2 |
                | row2 col1 | row2 col2 |

        @integration/api
        Scenario: Special1 Another dummy scenario