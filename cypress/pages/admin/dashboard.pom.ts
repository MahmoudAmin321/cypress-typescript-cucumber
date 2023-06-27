import { adminEndPoint, apis } from "../../support/consts";
import { ApiInfo } from "../../support/models/api";
import { Base } from "../common/base.pom";

class Dashboard extends Base {
  readonly relativeUrl = `/${adminEndPoint}/dashboard`;
  readonly dashboard = {
    container: () => cy.get("app-dashboard"),
    salesChart: () => cy.get("chart"),
  };

  getApiInfo(): ApiInfo {
    return apis.yearsSales;
  }
  waitForPage() {
    return cy.wait(`@${apis.yearsSales.interceptorName}`);
  }

  assertPage() {
    cy.url().should("match", new RegExp(`/${adminEndPoint}/dashboard$`));
    return this.dashboard.container().should("be.visible");
  }

  getButton(bddBtnName: string): Cypress.Chainable<any> {
    // Page has No uncommon buttons so far
    return null;
  }
}

const dashboardPage = new Dashboard();
export default dashboardPage;
