import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class ProductApi extends BaseAPI {
  get(productId: string): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificProduct.relativeUrl(productId)}`,
      method: "GET",
      failOnStatusCode: false,
    });
  }

  update(
    productId: string,
    reqBody: object
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificProduct.relativeUrl(productId)}`,
      method: "PUT",
      body: reqBody,
      failOnStatusCode: false,
    });
  }

  delete(
    productId: string,
    token: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificProduct.relativeUrl(productId)}`,
      method: "DELETE",
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
}

const productApi = new ProductApi();
export default productApi;
