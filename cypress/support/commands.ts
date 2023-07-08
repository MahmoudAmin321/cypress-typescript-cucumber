/// <reference types="cypress" />

import pagesFactory from "../pages/_common/pagesFactory";
import loginPage from "../pages/login.pom";
import { apis, tokenKeyName } from "./consts";
import { apiHost } from "./cyEnvVar";

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
Cypress.Commands.add("spyApi", (api, method = "GET", times = 1) => {
  cy.intercept(api.urlRegex, { method, times }, (req) => {
    delete req.headers["if-none-match"];
  }).as(api.interceptorName);

  // Make the custom command appear in cypress command log of cypress open mode
  Cypress.log({
    message: `Interceptor name ${api.interceptorName} with method ${method} for ${times} times`,
  });
});

Cypress.Commands.add(
  "stubApi",
  ({ api, method = "GET", times = 1, statusCode = 200, resBody }) => {
    cy.intercept(api.urlRegex, { method, times }, (req) => {
      req.reply(statusCode, resBody);
    }).as(api.interceptorName);

    // Make the custom command appear in cypress command log of cypress open mode
    Cypress.log({
      message: `Interceptor name ${api.interceptorName} with method ${method} for ${times} times`,
    });
  }
);

/**
 * UI login in all runs (1st and subsequent)
 * Useful for e2e (blackbox) tests
 */
Cypress.Commands.add("loginWithUI", (user) => {
  const homePage = pagesFactory.getLoginRedirectPage(user.bddName);

  const homePageApi = homePage.getApiInfo();

  // intercept page api, if applicable
  if (homePageApi) {
    cy.spyApi(homePageApi);
  }

  cy.visit(loginPage.relativeUrl);
  loginPage.typeCredentials(user);
  loginPage.form.loginBtn().click();

  homePage.waitForPage();

  // Make the custom command appear in cypress command log of cypress open mode
  Cypress.log({
    message: `UI login with user ${user.bddName}`,
  });
});

// /**
//  * UI login in 1st run, then progrmmatic login (by restoring cached token from local storage) in subseuquent runs.
//  * Useful, in case the programmatic login (i.e. by requesting login api) couldn't be acheived
//  */
// Cypress.Commands.add("loginWithUI", (user) => {
//   const chainable = cy.session(
//     `ui_login_session_id_for_ ${user.bddName}`,
//     () => {
//       cy.visit(loginPage.relativeUrl);
//       loginPage.typeCredentials(user);
//       loginPage.form.loginBtn().click();
//     },
//     {
//       validate() {
//         cy.window().its("localStorage").should("have.property", tokenKeyName);
//       }
//     }
//   );
// });

Cypress.Commands.add("loginProgrammatically", (user) => {
  const reqBody = { email: user.EMAIL, password: user.PASSWORD };

  const chainable = cy.session(
    `porgrammatic_login_session_id_for_ ${user.bddName}`,
    () => {
      cy.request({
        url: `${apiHost}${apis.login.relativeUrl()}`,
        method: "POST",
        body: reqBody,
      }).then((resp) => {
        window.localStorage.setItem(tokenKeyName, resp.body.access_token);
      });

      cy.visit("/");
    },
    {
      validate() {
        cy.window().its("localStorage").should("have.property", tokenKeyName);
      },
    }
  );

  return chainable;
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
