import { When } from "@badeball/cypress-cucumber-preprocessor";
import pagesFactory from "../../../pages/common/pagesFactory";
import commonBtns from "../../../pages/common/commonBtns";

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
    currentPage.getButton(bddBtnName).click();
    incomingPage.waitForPage();
  }
);

When(
  "{word} click on {string} button, which redirects to {string} page",
  function (_: string, bddBtnName: string, bddIncomingPageName: string) {
    commonBtns.getCommonButton(bddBtnName).click();
    const incomingPage = pagesFactory.getPage(bddIncomingPageName);
    incomingPage.waitForPage();
  }
);
