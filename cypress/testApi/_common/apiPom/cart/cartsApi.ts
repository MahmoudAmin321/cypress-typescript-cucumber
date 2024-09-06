import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { Helper } from "../../../../support/helper";
import { BaseAPI } from "../base.apiPom";

class CartsApi extends BaseAPI {
  post(): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.carts.relativeUrl()}`,
      method: "POST",
      failOnStatusCode: false,
    });
  }

  createAndStoreCart(): Cypress.Chainable<Cypress.Response<any>> {
    return this.post().then((postCartResp) => {
      const cartId: string = postCartResp.body.id;
      const dbJsonFile = "cypress/fixtures/cart-ids.json";
      Helper.storeCartIds([cartId], dbJsonFile);

      /* why need cy.then() here?
      you want to run async command storeCartIds(), then return sync value postCartResp.
      As sync code evaluates immediately, the async command will Not be evaluated. In
      this case, cypress will throw error. 
      cy.then() here ensures, that async command storeCartIds() finishes, then 
      sync value postCartResp gets returned
      */
      return cy.then(() => {
        return postCartResp;
      });
    });
  }

  
}

const cartsApi = new CartsApi();
export default cartsApi;
