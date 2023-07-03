/// <reference types="cypress" />

import { Before, After } from "@badeball/cypress-cucumber-preprocessor";

// This is a good place to put global before/beforeEach/after/afterEach hooks.
before(() => {
  cy.log(`global before all of mocha`);
});

beforeEach(() => {
  cy.log(`global beforeEach of mocha`);
});

afterEach(() => {
  cy.log(`global afterEach of mocha`);
});

after(() => {
  cy.log(`global after all of mocha`);
});

// global "Before" and "After" cucumber hooks
Before(() => {
  cy.log(`global before each of cucumber`);
});

After(() => {
  cy.log(`global after each of cucumber`);
});
