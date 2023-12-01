import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class BrandsSearchApi extends BaseAPI {
  search(searchValue: string): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.brandsSearch.relativeUrl()}?q=${searchValue}`,
      failOnStatusCode: false,
    });
  }
}

const brandsSearchApi = new BrandsSearchApi();
export default brandsSearchApi;
