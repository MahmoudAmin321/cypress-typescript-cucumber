import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";
import productsApi from "../product/productsApi";
import favoriteApi from "./favoriteApi";

class FavoritesApi extends BaseAPI {
  get(token: string): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.favorites.relativeUrl()}`,
      auth: {
        bearer: token,
      },
      method: "GET",
      failOnStatusCode: false,
    });
  }

  post(
    token: string,
    reqBody: object
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.favorites.relativeUrl()}`,
      auth: {
        bearer: token,
      },
      method: "POST",
      body: reqBody,
      failOnStatusCode: false,
    });
  }

  addProductToUserFavos(
    productName: string,
    userToken: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    // get target product id
    return productsApi.getProductId(productName).then((productId) => {
      // add the product to user favos
      const reqBody = {
        product_id: productId,
      };
      return favoritesApi.post(userToken, reqBody);
    });
  }

  cleanUp(userToken: string) {
    // Get all favorites of target user
    this.get(userToken).then((favoritesResp) => {
      const favorites: object[] = favoritesResp.body;
      // if this user has favorites, delete them
      if (favorites.length > 0) {
        favorites.forEach((favorite) =>
          // hint: delete favo api has bug (it deletes the favo by productId, Not favoId).
          favoriteApi
            .delete(favorite["product"]["id"], userToken)
            .then((deleteResp) => {
              expect(deleteResp.isOkStatusCode).to.eq(true);
            })
        );
      }
    });
  }
}

const favoritesApi = new FavoritesApi();
export default favoritesApi;
