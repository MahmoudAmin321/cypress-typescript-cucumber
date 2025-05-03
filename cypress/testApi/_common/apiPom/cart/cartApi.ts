import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";
import productsApi from "../product/productsApi";
import cartsApi from "./cartsApi";

class CartApi extends BaseAPI {
  get(cartId: string): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificCart.relativeUrl(cartId)}`,
      method: "GET",
      failOnStatusCode: false,
    });
  }

  readonly defaultProductQuantity = 1;

  addProductToCart(
    cartId: string,
    requestBody: object
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificCart.relativeUrl(cartId)}`,
      method: "POST",
      body: requestBody,
      failOnStatusCode: false,
    });
  }

  delete(cartId: string): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificCart.relativeUrl(cartId)}`,
      method: "DELETE",
      failOnStatusCode: false,
    });
  }

  setUp() {
    // get stored carts
    const dbJsonFile = "cypress/fixtures/cart-ids.json";
    cy.readFile(dbJsonFile).then((content) => {
      const cartIds: string[] = content.cart_ids;

      // delete carts
      cartIds.forEach((id, currentIndex, ids) => {
        this.delete(id).then((deleteCartResp) => {
          // if successful deletion Or id Not found error, delete the id from cart_ids array in db json file
          if (deleteCartResp.isOkStatusCode || deleteCartResp.status === 404) {
            currentIndex = 0;
            ids.splice(currentIndex, 1);

            cy.writeFile(dbJsonFile, content);
          } else {
            // throw error, that there was a problem, deleting {cartId}. Response from delete api was {response}
            throw Error(
              `problem in deleting cart id ${id}. Response from delete api was ${deleteCartResp}`
            );
          }
        });
      });
    });
  }

  checkQuantity(inputQuantity) {
    // precondition: create cart
    cartsApi.createAndStoreCart().then((postCartResp) => {
      const cartId: string = postCartResp.body.id;

      // precondition: create product
      productsApi.createProduct().then((productResp) => {
        const productId: string = productResp.body.id;

        const reqBody = {
          product_id: productId,
          quantity: inputQuantity,
        };

        // precondition: add product to cart
        this.addProductToCart(cartId, reqBody).then(() => {
          // retrieve cart
          this.get(cartId).then((cartResp) => {
            expect(cartResp.body.cart_items[0].quantity).to.eq(inputQuantity);
          });
        });
      });
    });
  }
}

const cartApi = new CartApi();
export default cartApi;
