import { When } from "@badeball/cypress-cucumber-preprocessor";
import pagesFactory from "../../../pages/_common/pagesFactory";
import { Base } from "../../../pages/_common/base.pom";

When(
  "{word} click on {string} button of {string} page, which redirects to {string} page",
  function (
    _: string,
    bddBtnName: string,
    bddCurrentPageName: string,
    bddIncomingPageName: string
  ) {
    const currentPage: Base = pagesFactory.getPage(bddCurrentPageName);
    const incomingPage: Base = pagesFactory.getPage(bddIncomingPageName);
    const api = incomingPage.getApiInfo();

    // intercept page api, if applicable
    if (api) {
      cy.spyApi(api);
    }

    currentPage.getButton(bddBtnName).click();

    incomingPage.waitForPage();
  }
);

When(
  "{word} click on {string} common button, which redirects to {string} page",
  function (_: string, bddBtnName: string, bddIncomingPageName: string) {
    const incomingPage: Base = pagesFactory.getPage(bddIncomingPageName);
    const api = incomingPage.getApiInfo();

    // intercept page api, if applicable
    if (api) {
      cy.spyApi(api);
    }

    Base.getButton(bddBtnName).click();

    incomingPage.waitForPage();
  }
);
