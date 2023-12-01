import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class BrandApi extends BaseAPI {
  readonly brandName = "Brand name";

  readonly brandData = (name = this.brandName) => {
    return { name, slug: name.toLowerCase().replace(/ /g, "-") };
  };

  get(brandId: string): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificBrand.relativeUrl(brandId)}`,
      method: "GET",
      failOnStatusCode: false,
    });
  }

  update(
    brandId: string,
    reqBody: object
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificBrand.relativeUrl(brandId)}`,
      method: "PUT",
      body: reqBody,
      failOnStatusCode: false,
    });
  }

  delete(
    brandId: string,
    token: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificBrand.relativeUrl(brandId)}`,
      method: "DELETE",
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
}

const brandApi = new BrandApi();
export default brandApi;
