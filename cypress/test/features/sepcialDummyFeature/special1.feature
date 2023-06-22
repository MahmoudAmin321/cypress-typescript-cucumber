Feature: SUT - Special1 feature
        - Description for the feature

        References:
        - BDD tags and statuses -> README.md

        * [Scenarios_Defined] - Special1 dummy rule



    Rule: Special1 dummy rule
        @e2e
        Scenario: Special1 dummy scenario
            Given Special1 dummy step
        @integration/comp
        Scenario Outline: Special1 dummy scenario outline
            When Special1 dummy step
            Examples:
                | header1   | header2   |
                | row1 col1 | row1 col2 |
                | row2 col1 | row2 col2 |

        @integration/program
        Scenario: Special1 another dummy scenario