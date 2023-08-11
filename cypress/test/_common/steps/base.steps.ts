import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import pagesFactory from "../../../pages/_common/pagesFactory";
import commonElements from "../../../pages/_common/commonElements";
import { User } from "../../../support/models/userInfo";
import { SortOptions } from "../../../support/models/sort/_sortOptions";
import { apis } from "../../../support/consts";
import homePage from "../../../pages/home.pom";
import sortFactory from "../../../support/models/sort/_sortFactory";
import keyboardFactory from "../../../support/models/keyboardFactory";

// Anti pattern. Only use as exception, when there is No other option
Given("{word} wait {int} seconds", function (_: string, seconds: number) {
  cy.wait(seconds * 1000);
});

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

    commonElements.getButton(bddBtnName).click();

    incomingPage.waitForPage();
  }
);

Given(
  "{word} programmatically login as {user}",
  function (_: string, user: User) {
    cy.loginProgrammatically(user.user);
  }
);

When(
  "{word} have {sortOption} sort option selected",
  function (_: string, bddSortOption: SortOptions) {
    //spy
    cy.spyApi(apis.products);

    // select
    commonElements.sortDropdown().select(bddSortOption.sortOptionValue);

    // wait
    cy.wait(`@${apis.products.interceptorName}`);
  }
);

Then(
  "Products should be sorted by {string} in {string} order",
  function (bddSortBy: string, bddSortOrder: string) {
    const sortOrder = sortFactory.getSortOrder(bddSortOrder);
    const desiredSort = sortFactory.getDesiredSort(bddSortBy);

    desiredSort.assertSort(sortOrder);
  }
);

When(
  "{word} hit {string} key {int} times",
  function (_: string, bddKeyName: string, times: number) {
    if (times % 2 != 0) {
      throw Error(
        `Instead of ${times} Please provide even number, as cypress hits the key twice, which is weird to me`
      );
    }
    const key = keyboardFactory.getKey(bddKeyName);

    for (let i = 0; i < times / 2; i++) {
      commonElements.body().type(key);
    }
  }
);
