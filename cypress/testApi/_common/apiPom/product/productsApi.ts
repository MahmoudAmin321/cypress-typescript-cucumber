import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class ProductsApi extends BaseAPI {
  get(
    url: string = `${apiHost}${apis.products.relativeUrl()}`
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url,
      method: "GET",
      failOnStatusCode: false,
    });
  }

  post(reqBody: object): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.products.relativeUrl()}`,
      method: "POST",
      body: reqBody,
      failOnStatusCode: false,
    });
  }
}

const productsApi = new ProductsApi();
export default productsApi;
