/// <reference types="cypress" />

import loginPage from "../pages/login.pom";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("interceptApi", (api, method = "GET", times = 1) => {
  cy.intercept(api.urlRegex, { method, times }, (req) => {
    delete req.headers["if-none-match"];
  }).as(api.interceptorName);

  // Make the custom command appear in cypress command log of cypress open mode
  Cypress.log({
    message: `Interceptor name ${api.interceptorName} with method ${method} for ${times} times`,
  });
});

Cypress.Commands.add("loginWithUI", (user) => {
  loginPage.typeCredentials(user);
  loginPage.form.loginBtn().click();

  // Make the custom command appear in cypress command log of cypress open mode
  Cypress.log({
    message: `UI login with user ${user}`,
  });
});

Cypress.Commands.add("loginProgrammatically", (user) => {
  // TODO

  // Make the custom command appear in cypress command log of cypress open mode
  Cypress.log({
    message: `Progrmmatic login with user ${user}`,
  });
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

// // Indicate, this .ts file is a module to avoid error [Augmentations for the global scope can only be directly nested in external modules or ambient module declarations.ts(2669)]
// export {};

// declare global {
//   namespace Cypress {
//     interface Chainable {
//       //   login(email: string, password: string): Chainable<void>
//       //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       //   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
