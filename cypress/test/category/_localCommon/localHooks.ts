/// <reference types="cypress" />

import { Before, After } from "@badeball/cypress-cucumber-preprocessor";

// This is a good place to put global before/beforeEach/after/afterEach hooks.
before(() => {
  cy.log(`local (category) before all of mocha`);
});

beforeEach(() => {
  cy.log(`local (category) beforeEach of mocha`);
});

afterEach(() => {
  cy.log(`local (category) afterEach of mocha`);
});

after(() => {
  cy.log(`local (category) after all of mocha`);
});

// global "Before" and "After" cucumber hooks
Before(() => {
  cy.log(`local (category) before each of cucumber`);
});

After(() => {
  cy.log(`local (category) after each of cucumber`);
});
