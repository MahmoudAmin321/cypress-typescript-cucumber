import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class CategoriesApi extends BaseAPI {
  url = `${apiHost}${apis.categories.relativeUrl()}`
  get(url = this.url, method = "GET"): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url,
      method,
      failOnStatusCode: false,
    });
  }
}

const categoriesApi = new CategoriesApi();
export default categoriesApi;
