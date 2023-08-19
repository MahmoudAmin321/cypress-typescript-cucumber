import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";
import loginApi from "./loginApi";
import registerApi from "./registerApi";

class ChangePwApi extends BaseAPI {
  readonly requestBody = {
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  };

  readonly newPW = Cypress.env("CHANGE_PW")["NEW_PW"];

  setup() {
    // register new user
    registerApi.register(registerApi.registrationData).then((registerResp) => {
      expect(registerResp.status).to.eq(201);
    });

    // login with this user
    return loginApi
      .login(
        registerApi.registrationData.email,
        registerApi.registrationData.password
      )
      .then((loginResp) => {
        const token: string = loginResp.body.access_token;
        return token;
      });
  }

  changePW(
    token: string,
    reqBody: object
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.changePW.relativeUrl()}`,
      method: "POST",
      body: reqBody,
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
      followRedirect: false,
    });
  }
}

const changePwApi = new ChangePwApi();
export default changePwApi;
