# cypress-typescript-cucumber

## Overview

- Purpose of this project is to demonstrate test automation.
- Automated tests are **GUI** and **API**
- Used stack: Cypress, Typescript, Cucumber
- **GUI tests location**: `cypress/test`
- **POM files location**: `cypress/pages`
- **API tests location**: `cypress/testApi`
- SUT:
  - UI: https://practicesoftwaretesting.com/
  - Swagger: https://api.practicesoftwaretesting.com/

## Prerequisites

- Nodejs: Starting from `18.0.0`
- Chrome: Starting from `97`
- Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex#browser_compatibility

## Cucumber scenarios tags list

- **Hint**: When a tag is set to a rule, all scenarios of this rule inherit this tag
- **`@e2e`**: The scenario is implemented black box (No programmatic implemention for preconditions)
- **`@program`**: The scenario's preconditions are implemented programmatically (UI avoided), if possible
  - **`/bdd`**: The scenario is implemented using cucumber (feature steps, step definitions)
  - **`/suite`**: The scenario is implemented using mocha test suites (describe, it)
- **`@todo`**: The scenario is to do
- **`@manual`**: For any reason, the scenario should be executed manually
- **`@not_automatable`**: For technical reasons, the scenario is not automatable

## Cucumber rules statuses list

- **`[Scenarios_Titles_Defined]`**: Only scenarios titles of the rule are implemented (No steps yet)
- **`[Scenarios_Defined]`**: All scenarios of the rules are implemented
  - Titles
  - Feature steps and step definitions , if program/bdd
  - Spec tests, if program/suite
- **`[Scenarios_Defined_Partially]`**: The rule is a mix of fully-defined scenarios and scenarios with only titles
