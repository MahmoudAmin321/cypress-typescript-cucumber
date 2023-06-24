import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import pagesFactory from "../../../pages/common/pagesFactory";
import { Base } from "../../../pages/common/base.pom";

Given(
  "{word} have {string} page opened",
  function (_: string, pageName: string) {
    const page: Base = pagesFactory.getPage(pageName);

    // intercept page api, if applicable
    const api = page.getApiInfo();
    if (api) {
      cy.interceptApi(api);
    }

    //visit page
    cy.visit(page.relativeUrl);

    //wait for page to avoid flakiness
    page.waitForPage();
  }
);

Then(
  "{word} should be redirected to {string} page",
  function (_: string, pageName: string) {
    const page = pagesFactory.getPage(pageName);
    page.assertPage();
  }
);
