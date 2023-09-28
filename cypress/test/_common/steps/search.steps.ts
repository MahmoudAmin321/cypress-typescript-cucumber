import { When } from "@badeball/cypress-cucumber-preprocessor";
import { Base } from "../../../pages/_common/base.pom";
import { apis } from "../../../support/consts";
import homePage from "../../../pages/home.pom";

When("{word} have reset", function (_: string) {
  // spy api
  cy.spyApi(apis.products, "GET");

  // reset
  Base.resetBtn().click();

  // wait for api
  cy.wait(`@${apis.products.interceptorName}`);
});

When("{word} have searched for {string}", function (_: string, bddSearchTerm: string) {
    // spy api
    cy.spyApi(apis.products, "GET");

    // input search term in search field
    homePage.searchField().clear().type(bddSearchTerm)

    // click search
    homePage.searchBtn().click();
  
    // wait for api
    cy.wait(`@${apis.products.interceptorName}`);
});