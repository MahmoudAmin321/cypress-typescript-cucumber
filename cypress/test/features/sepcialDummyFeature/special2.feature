Feature: SUT - Special2 feature
        - Description for the feature

        References:
        - Domain terminologies -> https://github.com/Symbyo360/CourierWeb/wiki/Domain-Terminologies-For-BDD
        - BDD tags and statuses -> https://github.com/Symbyo360/CourierWeb/wiki/BDD-Tags-and-Statuses

        * [Scenarios_Defined_Partially] - Dummy rule
        * [Scenarios_Defined] - Loging with email and password should be validated
        * [Scenarios_Titles_Defined] - User session (refresh token) behavior should be as expected
        * [Scenarios_Defined_Partially] - Group of different individual scenarios
        * [Scenarios_Titles_Defined] - Visual scenarios


    Rule: Special2 Dummy rule
        @e2e
        Scenario: Special2 Dummy scenario
            Given Special2 Dummy step
        @integration/comp
        Scenario Outline: Special2 Dummy scenario outline
            When Special2 Dummy step
            Examples:
                | header1   | header2   |
                | row1 col1 | row1 col2 |
                | row2 col1 | row2 col2 |

        @integration/program
        Scenario: Special2 Another dummy scenario