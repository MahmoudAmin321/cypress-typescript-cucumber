import { apis } from "../support/consts";
import { ApiInfo } from "../support/models/api";
import { Base } from "./_common/base.pom";
import productCards from "./_common/product/productCards";

class Home extends Base {
  readonly relativeUrl = "/";
  readonly resetBtn = () => cy.get("[data-test=search-reset]");
  readonly searchBtn = () => cy.get("[data-test=search-submit]");

  readonly productCards = () => productCards.getProductCards();

  getApiInfo(): ApiInfo {
    return apis.products;
  }

  waitForPage() {
    return cy.wait(`@${apis.products.interceptorName}`);
  }

  getButton(bddBtnName: string): Cypress.Chainable<any> {
    if (bddBtnName.toLowerCase().match(/reset/)) {
      return this.resetBtn();
    } else if (bddBtnName.toLowerCase().match(/search/)) {
      return this.searchBtn();
    } else {
      throw Error(`Button [ ${bddBtnName} ] doesn't exist in the map`);
    }
  }
}

const homePage = new Home();
export default homePage;
