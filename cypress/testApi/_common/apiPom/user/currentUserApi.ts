import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class CurrentUserApi extends BaseAPI {
  readonly userInfoAliasName = "expectedUserInfo";

  getCurrentUser(
    token: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.currentUser.relativeUrl()}`,
      method: "GET",
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
}

const currentUserApi = new CurrentUserApi();
export default currentUserApi;
