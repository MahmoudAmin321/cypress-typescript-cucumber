import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class ImageApi extends BaseAPI {
  url = `${apiHost}${apis.images.relativeUrl()}`
  get(url = this.url, method = "GET"): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url,
      method,
      failOnStatusCode: false,
    });
  }
}

const imagesApi = new ImageApi();
export default imagesApi;
