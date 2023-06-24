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
    cy.interceptApi(apis.yearsSales);
    return cy.wait(`@${apis.yearsSales.interceptorName}`);
  }

  assertPage() {
    cy.url().should("match", new RegExp(`/${adminEndPoint}/dashboard$`));
    return this.dashboard.container().should("be.visible");
  }

  getButton(businessBtnName: string): Cypress.Chainable<any> {
    // Page has No uncommon buttons so far
    return null;
  }
}

const dashboardPage = new Dashboard();
export default dashboardPage;
