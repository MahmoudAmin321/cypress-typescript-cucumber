import { apis, users } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";
import loginApi from "../user/loginApi";
import categoryApi from "./categoryApi";

class CategoriesApi extends BaseAPI {
  url = `${apiHost}${apis.categories.relativeUrl()}`;

  readonly categoryName = "Category name";

  readonly categoryData = (name = this.categoryName) => {
    return { name, slug: name.toLowerCase().replace(/ /g, "-") };
  };

  get(
    url = this.url,
    method = "GET",
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url,
      method,
      failOnStatusCode: false,
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

    // delete all categories that include "test" in their name
    cy.then(() => {
      this.get().then((catsResp) => {
        const cats: object[] = catsResp.body;
        cats.forEach((cat) => {
          const catName: string = cat["name"];
          if (catName.toLowerCase().includes("test")) {
            if (!(cat["parent_id"] === null)) {
              // unlink child cat from parent cat
              categoryApi.patch(
                cat["id"],
                {
                  parent_id: null,
                },
                adminToken,
              );

              categoryApi.delete(cat["id"], adminToken);
            } else categoryApi.delete(cat["id"], adminToken);
          }
        });
      });
    });
  }
}

const categoriesApi = new CategoriesApi();
export default categoriesApi;
