import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class CategoryApi extends BaseAPI {
  patch(
    catId: string,
    reqBody: object,
    token: string,
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificCategory.relativeUrl(catId)}`,
      method: "PATCH",
      body: reqBody,
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }

  delete(
    catId: string,
    token: string,
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificCategory.relativeUrl(catId)}`,
      method: "DELETE",
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
}

const categoryApi = new CategoryApi();
export default categoryApi;
