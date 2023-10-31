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

  searchBrands(brandId: string, brands: object[]): number {
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
      return count + this.searchBrands(brandId, restOfBrands);
    }
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
    brandApi.resetBrandData();
    brandApi.brandData = {
      name: brandApi.brandData.name + " 1",
      slug: brandApi.brandData.slug + "-1",
    };
    brandApi.create();

    cy.then(() => {
      brandApi.resetBrandData();
      brandApi.brandData = {
        name: brandApi.brandData.name + " 2",
        slug: brandApi.brandData.slug + "-2",
      };
      brandApi.create();
    });

    cy.then(() => {
      brandApi.resetBrandData();
    });
  }
}

const brandsApi = new BrandsApi();
export default brandsApi;
