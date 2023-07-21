import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";

class UsersApi {
  getUsers(token: string): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.users.relativeUrl()}`,
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
}

const usersApi = new UsersApi();
export default usersApi;
