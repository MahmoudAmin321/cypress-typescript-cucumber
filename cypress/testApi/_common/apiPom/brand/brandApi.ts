import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class BrandApi extends BaseAPI {
  readonly brandAliasName = "brand";
  private readonly brandName = "Brand name";
  private readonly brandSlug = this.brandName.toLowerCase().replace(" ", "-");
  brandData = {
    name: this.brandName,
    slug: this.brandSlug,
  };

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

  post(reqBody: object): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.brands.relativeUrl()}`,
      method: "POST",
      body: reqBody,
      failOnStatusCode: false,
    });
  }

  create() {
    return this.post(this.brandData).then((brandResp) => {
      // Make sure brand is created
      if (brandResp.body.slug[0]?.match(/brand(.*)already exists(.*)slug/)) {
        return; // exit function
      } else {
        expect(brandResp.status).to.eq(201);
        const actualName: string = brandResp.body.name;
        const brandId: string = brandResp.body.id;
        expect(actualName).to.eq(this.brandData.name);

        return { brandName: actualName, brandId: brandId };
      }
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
