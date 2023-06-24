import { When } from "@badeball/cypress-cucumber-preprocessor";
import pagesFactory from "../../../pages/common/pagesFactory";
import commonBtns from "../../../pages/common/commonBtns";

When(
  "{word} click on {string} button of {string} page",
  function (_: string, businessBtnName: string, businessPageName: string) {
    const page = pagesFactory.getPage(businessPageName);
    page.getButton(businessBtnName).click();
  }
);

When(
  "{word} click on {string} button",
  function (_: string, businessBtnName: string) {
    commonBtns.getCommonButton(businessBtnName).click();
  }
);
