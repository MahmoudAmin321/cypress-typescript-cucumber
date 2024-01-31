import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class FavoriteApi extends BaseAPI {
  get(
    favoriteId: string,
    token: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificFavorite.relativeUrl(favoriteId)}`,
      method: "GET",
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
  
  delete(
    favoriteId: string,
    token: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificFavorite.relativeUrl(favoriteId)}`,
      method: "DELETE",
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }
}

const favoriteApi = new FavoriteApi();
export default favoriteApi;
