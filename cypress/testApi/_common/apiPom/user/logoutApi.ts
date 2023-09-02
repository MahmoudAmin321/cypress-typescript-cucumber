import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class LogoutApi extends BaseAPI {
  logout(
    token: string, method= "GET"
  ): Cypress.Chainable<Cypress.Response<any>> {
    return  cy.request({
      url: `${apiHost}${apis.logout.relativeUrl()}`,
      method,
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    })
  }
}

const logoutApi = new LogoutApi();
export default logoutApi;
