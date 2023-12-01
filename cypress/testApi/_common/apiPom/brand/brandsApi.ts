import { apis, dbIdRegex, users } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";
import loginApi from "../user/loginApi";
import brandApi from "./brandApi";

class BrandsApi extends BaseAPI {
  requestBrands(
    method = "GET",
    relativeUrl = apis.brands.relativeUrl()
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${relativeUrl}`,
      method,
      failOnStatusCode: false,
    });
  }

  searchInBrands(brandId: string, brands: object[]): number {
    // validate brandId
    if (!brandId.match(dbIdRegex)) {
      throw Error(`Invalid brand id ${brandId}`);
    }

    let count = 0;
    if (brands.length == 0) {
      return count;
    } else {
      const firstBrand = brands[0];
      if (brandId === firstBrand["id"]) {
        count++;
      }
      const restOfBrands = brands.slice(1);
      return count + this.searchInBrands(brandId, restOfBrands);
    }
  }

  post(reqBody: object): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.brands.relativeUrl()}`,
      method: "POST",
      body: reqBody,
      failOnStatusCode: false,
    });
  }

  createNewBrand(brandData = brandApi.brandData()) {
    return this.post(brandData).then((brandResp) => {
      // Make sure brand is created
      if (brandResp.body.slug[0]?.match(/brand(.*)already exists(.*)slug/)) {
        return; // exit function
      } else {
        expect(brandResp.status).to.eq(201);
        const actualName: string = brandResp.body.name;
        const actualSlug: string = brandResp.body.slug;
        const brandId: string = brandResp.body.id;
        expect(actualName).to.eq(brandData.name);
        expect(actualSlug).to.eq(brandData.slug);

        return { name: actualName, id: brandId, slug: actualSlug };
      }
    });
  }

  cleanUp() {
    // login as admin
    let adminToken: string;
    loginApi
      .login(users.admin.EMAIL, users.admin.PASSWORD)
      .then((loginResp) => {
        adminToken = loginResp.body.access_token;
      });

    // delete all brands except already used
    cy.then(() => {
      this.requestBrands().then((brandsResp) => {
        const brands: object[] = brandsResp.body;
        brands.forEach((brand) => {
          brandApi.delete(brand["id"], adminToken);
        });
      });
    });
  }

  setUp() {
    let brandData = brandApi.brandData(brandApi.brandName + " 1");
    this.createNewBrand(brandData);

    cy.then(() => {
      brandData = brandApi.brandData(brandApi.brandName + " 2");
      this.createNewBrand(brandData);
    });
  }
}

const brandsApi = new BrandsApi();
export default brandsApi;
