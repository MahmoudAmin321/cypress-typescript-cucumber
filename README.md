# cypress-typescript-cucumber

## Overview

- Purpose of this project is to demonstrate test automation.
- Automated tests are integration and e2e.
- Used stack: Cypress, Typescript, Cucumber
- **Tests location**: `cypress/test/features`
- **POM files location**: `cypress/pages`

## Cucumber scenarios tags list

- **Hint**: When a tag is set to a rule, all scenarios of this rule inherit this tag
- **`@e2e`**: The scenario is implemented black box (No programmatic implemention for preconditions)
- **`@integration/program`**: The scenario's preconditions are implemented programmatically (UI avoided), if possible
- **`@integration/comp`**: The scenario tests the front end components (No contact with backend)

## Cucumber rules statuses list

- **`[Scenarios_Titles_Defined]`**: Only scenarios titles of the rule are implemented (No steps yet)
- **`[Scenarios_Defined]`**: All scenarios of the rules are implemented (titles, feature steps and step definitions)
- **`[Scenarios_Defined_Partially]`**: The rule is a mix of fully-defined scenarios and scenarios with only titles
