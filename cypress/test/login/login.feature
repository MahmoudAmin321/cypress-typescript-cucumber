Feature: SUT - Login feature
        - Login feature

        References:
        - BDD tags and statuses -> README.md

        Feature rules:
        * [Scenarios_Defined_Partially] - User can login successfully
        * [Scenarios_Defined_Partially] - Login with email and password should be validated

    @e2e
    Rule: Users can login successfully

        Scenario Outline:  <user> can login successfully
            Given You have "login" page opened
            When You enter credentials of "<user>"
            And You click on "login" button of "login" page, which redirects to "<home page>" page
            Then You should be redirected to "<home page>" page

            Examples:
                | user      | home page |
                | Admin     | dashboard |
                | Customer1 | account   |

        @todo
        Scenario: Login with correct (registered) email with wrong casing should be successful

    Rule: Email and password fields should be validated

        @integration/comp
        Scenario Outline: Upon entering <email> as email, <email msg> should be displayed
            Examples:
                | email    | email msg                 |
                |          | E-mail is required.       |
                | invalid@ | E-mail format is invalid. |

        @integration/comp @todo
        Scenario Outline: Upon entering <pw> as password, <pw msg> should be displayed
            Examples:
                | pw | pw msg                      |
                |    | Password is required.       |
                | ip | Password length is invalid. |

        @e2e @todo
        Scenario: Login with valid, but wrong (unregistered) credentials should fail

        @e2e @todo
        Scenario: Login with correct (registerd) password with wrong casing should fail