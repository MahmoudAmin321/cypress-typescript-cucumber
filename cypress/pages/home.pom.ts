import { apis } from "../support/consts";
import { ApiInfo } from "../support/models/api";
import { Base } from "./_common/base.pom";
import productCards from "./_common/product/productCards";

class Home extends Base {
  readonly relativeUrl = ()=> "/";

  readonly priceRange = {
    leftBtn: () => cy.get("[role=slider][class*=min]"),
    rightBtn: () => cy.get("[role=slider][class*=max]"),
    leftValue: () => cy.get("[class*=slider-model-value]"),
    rightValue: () => cy.get("[class*=slider-model-high]"),
  };

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
    const lowerCase = bddBtnName.toLowerCase();
    if (lowerCase.match(/reset/)) {
      return this.resetBtn();
    } else if (lowerCase.match(/search/)) {
      return this.searchBtn();
    } else if (lowerCase.match(/right/)) {
      return this.priceRange.rightBtn();
    } else if (lowerCase.match(/left/)) {
      return this.priceRange.leftBtn();
    } else {
      throw Error(`Button [ ${bddBtnName} ] doesn't exist in the map`);
    }
  }

  getValueElement(bddPosition: string): Cypress.Chainable<any> {
    if (bddPosition.toLowerCase().match(/right/)) {
      return this.priceRange.rightValue();
    } else if (bddPosition.toLowerCase().match(/left/)) {
      return this.priceRange.leftValue();
    } else {
      throw Error(`Position [ ${bddPosition} ] doesn't exist in the map`);
    }
  }
}

const homePage = new Home();
export default homePage;
