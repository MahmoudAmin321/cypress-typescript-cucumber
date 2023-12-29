import { apis, customerEndPoint } from "../../support/consts";
import { ApiInfo } from "../../support/models/api";
import { Base } from "../_common/base.pom";

class MyFavorites extends Base {
  readonly relativeUrl = ()=> `/${customerEndPoint}/favorites`;

  readonly container = () => cy.get("app-favorites");
  readonly favorites = () => cy.get("[data-test^=favorite-]");

  getApiInfo(): ApiInfo {
    return apis.favorites;
  }

  waitForPage() {
    return cy.wait(`@${apis.favorites.interceptorName}`);
  }

  assertPage() {
    cy.url().should("match", new RegExp(`${this.relativeUrl()}$`));
    return this.container().should("be.visible");
  }

  getButton(bddBtnName: string): Cypress.Chainable<any> {
    return null
  }
}

const myFavoritesPage = new MyFavorites();
export default myFavoritesPage;
