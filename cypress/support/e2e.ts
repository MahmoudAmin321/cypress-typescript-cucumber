// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

const currentTestEnv: string = Cypress.env("CURRENT_TESTING_ENV");
export const uiHost: string =
  Cypress.env("TESTING_ENVS")[currentTestEnv]["UI_HOST"];
// set baseUrl. You didn't do it in cypress.config.ts, because baserUrl there doesn't accept Cypress.env() as value (The error [Cypress is Not defined ] gets thrown)
Cypress.config("baseUrl", uiHost);

// Alternatively you can use CommonJS syntax:
// require('./commands')
