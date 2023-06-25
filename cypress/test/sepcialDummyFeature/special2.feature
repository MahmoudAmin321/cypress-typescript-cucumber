Feature: SUT - Special2 feature
        - Description for the feature

        References:
        - BDD tags and statuses -> README.md

        * [Scenarios_Defined] - Special2 dummy rule


    Rule: Special2 dummy rule
        @e2e
        Scenario: Special2 dummy scenario
            Given Special2 dummy step
        @program/suite
        Scenario Outline: Special2 dummy scenario outline
            When Special2 dummy step
            Examples:
                | header1   | header2   |
                | row1 col1 | row1 col2 |
                | row2 col1 | row2 col2 |

        @program/bdd
        Scenario: Special2 another dummy scenario