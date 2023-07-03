/// <reference types="cypress" />

import { Before, After } from "@badeball/cypress-cucumber-preprocessor";

// This is a good place to put global before/beforeEach/after/afterEach hooks.
before(() => {
  cy.log(`local (product) before all of mocha`);
});

beforeEach(() => {
  cy.log(`local (product) beforeEach of mocha`);
});

afterEach(() => {
  cy.log(`local (product) afterEach of mocha`);
});

after(() => {
  cy.log(`local (product) after all of mocha`);
});

// global "Before" and "After" cucumber hooks
Before(() => {
  cy.log(`local (product) before each of cucumber`);
});

After(() => {
  cy.log(`local (product) after each of cucumber`);
});
