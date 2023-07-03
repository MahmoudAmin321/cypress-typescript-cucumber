import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
import pagesFactory from "../../../pages/_common/pagesFactory";
import commonBtns from "../../../pages/_common/commonBtns";
import { User } from "../../../support/models/userInfo";

When(
  "{word} click on {string} button of {string} page, which redirects to {string} page",
  function (
    _: string,
    bddBtnName: string,
    bddCurrentPageName: string,
    bddIncomingPageName: string
  ) {
    const currentPage = pagesFactory.getPage(bddCurrentPageName);
    const incomingPage = pagesFactory.getPage(bddIncomingPageName);
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
  "{word} click on {string} button, which redirects to {string} page",
  function (_: string, bddBtnName: string, bddIncomingPageName: string) {
    const incomingPage = pagesFactory.getPage(bddIncomingPageName);
    const api = incomingPage.getApiInfo();

    // intercept page api, if applicable
    if (api) {
      cy.spyApi(api);
    }

    commonBtns.getCommonButton(bddBtnName).click();

    incomingPage.waitForPage();
  }
);

Given(
  "{word} progrmmatically login as {user}",
  function (_: string, user: User) {
    cy.loginProgrammatically(user.user);
  }
);
