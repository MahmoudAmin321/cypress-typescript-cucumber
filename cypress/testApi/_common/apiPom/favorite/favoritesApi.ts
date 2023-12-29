import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";
import favoriteApi from "./favoriteApi copy";

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

  cleanUp(userToken: string) {
    // Get all favorites of target user
    this.get(userToken).then((favoritesResp) => {
      const favorites: object[] = favoritesResp.body;
      // if this user has favorites, delete them
      if (favorites.length > 0) {
        favorites.forEach((favorite) =>
          favoriteApi.delete(favorite["product"]["id"], userToken)
        );
      }
    });
  }
}

const favoritesApi = new FavoritesApi();
export default favoritesApi;
