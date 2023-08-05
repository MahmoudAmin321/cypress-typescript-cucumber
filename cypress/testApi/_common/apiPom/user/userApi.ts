import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";

class UserApi {
  deleteUser(
    userId: number,
    token: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificUser.relativeUrl(userId)}`,
      method: "DELETE",
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }

  getUser(
    userId: number,
    token: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificUser.relativeUrl(userId)}`,
      method: "GET",
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
}

const userApi = new UserApi();
export default userApi;
