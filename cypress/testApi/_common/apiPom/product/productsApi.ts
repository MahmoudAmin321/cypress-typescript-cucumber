import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";
import brandApi from "../brand/brandApi";
import brandsApi from "../brand/brandsApi";
import categoriesApi from "../category/categoriesApi";
import imagesApi from "../image/imageApi";

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
  getDefaultProductReqBodyData(): Cypress.Chainable<{
    name: string;
    description: string;
    price: number;
    category_id: string;
    brand_id: string;
    product_image_id: string;
    is_location_offer: number;
    is_rental: number;
  }> {
    // get image id (i.e. 1st id)
    return imagesApi.get().then((imgsResp) => {
      const imgId: string = imgsResp.body[0].id;

      // get category id (i.e. 1st id)
      return categoriesApi.get().then((categoriesResp) => {
        const categoryId: string = categoriesResp.body[0].id;

        // get brand id (i.e. 1st id)
        return brandsApi.requestBrands().then((brandsResp) => {
          const brandId: string = brandsResp.body[0].id;

          // prepare request body default data
          const defaultData = {
            name: "test product name",
            description: "default product description",
            price: 15.55,
            category_id: categoryId,
            brand_id: brandId,
            product_image_id: imgId,
            is_location_offer: 1,
            is_rental: 0,
          };

          return cy.then(() => {
            return defaultData;
          });
        });
      });
    });
  }

  /**
   * 
   * @param chainableData example: 
   * const data = cy.then(() => {
            return {
              name: "test product name",
              description: "default product description",
              price: 15.55,
              category_id: "01J5NJE24JKAC8QHZ4J8FDMR6E",
              brand_id: "01J5NJE24C19MWBN8Z5TDP0MKJ",
              product_image_id: "01J5NJE24RJ49F42C9JQSTXHAK",
              is_location_offer: 1,
              is_rental: 0,
            };
          });
          
          productsApi.createProduct(data)
   * @returns 
   */
  createProduct(
    chainableData = this.getDefaultProductReqBodyData()
  ): Cypress.Chainable<Cypress.Response<any>> {
    return chainableData.then((furtherData) => {
      return this.post(furtherData);
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
      return productId;
    });
  }
}

const productsApi = new ProductsApi();
export default productsApi;
