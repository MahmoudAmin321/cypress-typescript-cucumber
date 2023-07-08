import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import pagesFactory from "../../../pages/_common/pagesFactory";
import commonBtns from "../../../pages/_common/commonBtns";
import { User } from "../../../support/models/userInfo";
import { SortOptions } from "../../../support/models/sort/_sortOptions";
import { apis } from "../../../support/consts";
import homePage from "../../../pages/home.pom";
import sortFactory from "../../../support/models/sort/_sortFactory";

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

When(
  "{word} have {sortOption} sort option selected",
  function (_: string, bddSortOption: SortOptions) {
    //spy
    cy.spyApi(apis.products);

    // select
    homePage.sortDropdown().select(bddSortOption.sortOptionValue);

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
