/// <reference types="cypress" />

import { Before, After } from "@badeball/cypress-cucumber-preprocessor";

// This is a good place to put global before/beforeEach/after/afterEach hooks.
before(() => {
  cy.log(`local (cart) before all of mocha`);
});

beforeEach(() => {
  cy.log(`local (cart) beforeEach of mocha`);
});

afterEach(() => {
  cy.log(`local (cart) afterEach of mocha`);
});

after(() => {
  cy.log(`local (cart) after all of mocha`);
});

// global "Before" and "After" cucumber hooks
Before(() => {
  cy.log(`local (cart) before each of cucumber`);
});

After(() => {
  cy.log(`local (cart) after each of cucumber`);
});
