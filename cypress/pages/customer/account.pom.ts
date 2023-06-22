import { adminEndPoint, apis, customerEndPoint } from "../../support/consts";
import { uiHost } from "../../support/cyEnvVar";
import { Base } from "../common/base.pom";

class Account extends Base {
  readonly relativeUrl = `/${adminEndPoint}/dashboard`;

  readonly favorites = () => cy.get("[data-test=nav-favorites]");
  readonly profile = () => cy.get("[data-test=nav-profile]");

  waitForPage() {
    cy.interceptApi(apis.currentUser);
    return cy.wait(apis.currentUser.interceptorName);
  }

  assertPage() {
    cy.url().should("match", new RegExp(`/${customerEndPoint}$`));
    this.profile().should("be.visible");
  }

  getButton(businessBtnName: string): Cypress.Chainable<any> {
    if (businessBtnName.toLowerCase().match(/^favo(.*)/)) {
      return this.favorites();
    } else if (businessBtnName.toLowerCase().match(/^profil(.*)/)) {
      return this.profile();
    } else {
      throw Error(`Button [ ${businessBtnName} ] doesn't exist in the map`);
    }
  }
}

const accountPage = new Account();
export default accountPage;
