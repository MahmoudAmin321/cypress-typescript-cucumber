import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

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

      //log
      cy.log("content ", content);
      cy.log("cart ids ", cartIds);

      // delete carts
      cartIds.forEach((id, currentIndex, ids) => {
        this.delete(id).then((deleteCartResp) => {
          // if successful deletion Or id Not found error, delete the id from cart_ids array in db json file
          if (deleteCartResp.isOkStatusCode || deleteCartResp.status === 404) {
            currentIndex = 0;
            ids.splice(currentIndex, 1);

            //log
            cy.log("ci ", currentIndex);
            cy.log("content ", content);
            cy.log("cart ids ", cartIds);
            cy.log("ids ", ids);

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
}

const cartApi = new CartApi();
export default cartApi;
