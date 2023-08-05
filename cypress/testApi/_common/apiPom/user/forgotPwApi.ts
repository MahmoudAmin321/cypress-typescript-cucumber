import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class ForgotPwApi extends BaseAPI {
  resetPw(email: string): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.forgotPW.relativeUrl()}`,
      method: "POST",
      body: {
        email,
      },
      failOnStatusCode: false,
    });
  }
}

const forgotPwApi = new ForgotPwApi();
export default forgotPwApi;
