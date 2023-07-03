import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class LoginApi extends BaseAPI {
  login(
    email: string,
    password: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.login.relativeUrl()}`,
      method: "POST",
      body: {
        email,
        password,
      },
      failOnStatusCode: false,
    });
  }
}

const loginApi = new LoginApi();
export default loginApi;
