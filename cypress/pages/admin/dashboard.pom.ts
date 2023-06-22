import { adminEndPoint, apis } from "../../support/consts";
import { uiHost } from "../../support/cyEnvVar";
import { ApiInfo } from "../../support/models/apiInfo";
import { Base } from "../common/base.pom";

class Dashboard extends Base {
  readonly relativeUrl = `/${adminEndPoint}/dashboard`;
  readonly dashboard = {
    container: () => cy.get("app-dashboard"),
    salesChart: () => cy.get("chart"),
  };

  waitForPage() {
    cy.interceptApi(apis.currentUser);
    return cy.wait(apis.currentUser.interceptorName);
  }

  assertPage() {
    cy.url().should("match", new RegExp(`/${adminEndPoint}/dashboard$`));
    this.dashboard.container().should("be.visible");
  }

  getButton(businessBtnName: string): Cypress.Chainable<any> {
    // Page has No uncommon buttons so far
    return null;
  }
}

const dashboardPage = new Dashboard();
export default dashboardPage;
