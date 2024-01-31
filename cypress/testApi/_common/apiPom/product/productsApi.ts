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

  /**
   * GET all products of all pages in one array
   */
  getAllProducts(): Cypress.Chainable<object[]> {
    const products: object[] = [];
    this.get().then((productsResp) => {
      // get last page
      const lastPage: number = productsResp.body.last_page;
      for (let nr = 1; nr <= lastPage; nr++) {
        this.get(`${apiHost}${apis.products.relativeUrl()}?page=${nr}`).then(
          (productsResp) => {
            const currentPageProducts: object[] = productsResp.body.data;
            products.push(...currentPageProducts);
          }
        );
      }
    });

    return cy.then(() => {
      return products;
    });
  }

  /**
   * search for target product
   * @param productName target product name
   * @param products
   * @returns product id if found, otherwise undefined
   */
  search(productName: string, products: object[]): string {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (
        product["name"].trim().toLowerCase() ===
        productName.trim().toLowerCase()
      ) {
        // store id of the target product
        return product["id"];
      }
    }
    return undefined;
  }

  getProductId(productName: string): Cypress.Chainable<string> {
    return productsApi.getAllProducts().then((products) => {
      const productId = productsApi.search(productName, products);
      if (!productId) {
        throw new Error(`product ${productName} Not found`);
      }
      return productId
    });
  }
}

const productsApi = new ProductsApi();
export default productsApi;
