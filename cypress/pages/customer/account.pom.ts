import { apis, customerEndPoint } from "../../support/consts";
import { ApiInfo } from "../../support/models/api";
import { Base } from "../_common/base.pom";

class Account extends Base {
  readonly relativeUrl = `/${customerEndPoint}`;

  readonly favorites = () => cy.get("[data-test=nav-favorites]");
  readonly profile = () => cy.get("[data-test=nav-profile]");

  getApiInfo(): ApiInfo {
    return apis.currentUser;
  }

  waitForPage() {
    return cy.wait(`@${apis.currentUser.interceptorName}`);
  }

  assertPage() {
    cy.url().should("match", new RegExp(`/${customerEndPoint}$`));
    return this.profile().should("be.visible");
  }

  getButton(bddBtnName: string): Cypress.Chainable<any> {
    if (bddBtnName.toLowerCase().match(/^favo(.*)/)) {
      return this.favorites();
    } else if (bddBtnName.toLowerCase().match(/^profil(.*)/)) {
      return this.profile();
    } else {
      throw Error(`Button [ ${bddBtnName} ] doesn't exist in the map`);
    }
  }
}

const accountPage = new Account();
export default accountPage;
