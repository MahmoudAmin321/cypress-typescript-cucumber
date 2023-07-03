/// <reference types="cypress" />

import { Before, After } from "@badeball/cypress-cucumber-preprocessor";

// This is a good place to put global before/beforeEach/after/afterEach hooks.
before(() => {
  cy.log(`local (login) before all of mocha`);
});

beforeEach(() => {
  cy.log(`local (login) beforeEach of mocha`);
});

afterEach(() => {
  cy.log(`local (login) afterEach of mocha`);
});

after(() => {
  cy.log(`local (login) after all of mocha`);
});

// global "Before" and "After" cucumber hooks
Before(() => {
  cy.log(`local (login) before each of cucumber`);
});

After(() => {
  cy.log(`local (login) after each of cucumber`);
});
