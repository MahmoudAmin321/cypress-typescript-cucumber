import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class RefreshTokenApi extends BaseAPI {
  refreshToken(
   token: string, method = "GET"
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.refreshToken.relativeUrl()}`,
      method,
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
}

const refreshTokenApi = new RefreshTokenApi();
export default refreshTokenApi;
