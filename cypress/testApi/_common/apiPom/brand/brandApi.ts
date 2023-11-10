import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class BrandApi extends BaseAPI {
  private readonly brandName = "Brand name";
  private readonly brandSlug = this.brandName.toLowerCase().replace(" ", "-");
  brandData = {
    name: this.brandName,
    slug: this.brandSlug,
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

  resetBrandData() {
    this.brandData = {
      name: this.brandName,
      slug: this.brandSlug,
    };
  }
}

const brandApi = new BrandApi();
export default brandApi;
