import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class UserApi extends BaseAPI {
  readonly userAliasName = "user";

  userData = {
    first_name: "test ed",
    last_name: "Doe ed",
    address: "Street 1 ed",
    city: "City ed",
    state: "State ed",
    country: "Country ed",
    postcode: "1234AA ed",
    phone: "709876543213",
    dob: "1973-03-03",
    email: "update@test.test",
    password: "updatePW12345",
  };

  deleteUser(
    userId: string,
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

  updateUser(
    userId: string,
    token: string,
    reqBody: object
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificUser.relativeUrl(userId)}`,
      method: "PUT",
      auth: {
        bearer: token,
      },
      body: reqBody,
      failOnStatusCode: false,
    });
  }

  getUser(
    userId: string,
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

  resetUserData() {
    this.userData = {
      first_name: "test ed",
      last_name: "Doe ed",
      address: "Street 1 ed",
      city: "City ed",
      state: "State ed",
      country: "Country ed",
      postcode: "1234AA ed",
      phone: "709876543213",
      dob: "1973-03-03",
      email: "update@test.test",
      password: "updatePW12345",
    };
  }
}

const userApi = new UserApi();
export default userApi;
