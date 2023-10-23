import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class UsersSearchApi extends BaseAPI {
  search(
    token: string,
    searchBy: string,
    searchValue: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.usersSearch.relativeUrl()}?${searchBy}=${searchValue}`,
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
}

const usersSearchApi = new UsersSearchApi();
export default usersSearchApi;
