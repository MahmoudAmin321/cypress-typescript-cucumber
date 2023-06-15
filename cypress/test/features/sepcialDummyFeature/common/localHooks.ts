/// <reference types="cypress" />

import { Before, After } from "@badeball/cypress-cucumber-preprocessor";

// This is a good place to put global before/beforeEach/after/afterEach hooks.
before(() => {
  cy.log(`local before all of mocha`);
});

beforeEach(() => {
  cy.log(`local beforeEach of mocha`);
});

afterEach(() => {
  cy.log(`local afterEach of mocha`);
});

after(() => {
  cy.log(`local after all of mocha`);
});

// global "Before" and "After" cucumber hooks
Before(() => {
  cy.log(`local before each of cucumber`);
});

After(() => {
  cy.log(`local after each of cucumber`);
});
