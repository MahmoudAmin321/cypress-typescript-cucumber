import { apis, users } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import loginApi from "./loginApi";

class UserApi {
  deleteUser(
    userId: number,
    token: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificUser.relativeUrl(userId)}`,
      method: "DELETE",
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }

  getUser(
    userId: number,
    token: string
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.specificUser.relativeUrl(userId)}`,
      method: "GET",
      auth: {
        bearer: token,
      },
      failOnStatusCode: false,
    });
  }

  cleanUp(id: number) {
    return loginApi
      .login(users.admin.EMAIL, users.admin.PASSWORD)
      .then((loginResp) => {
        const token = loginResp.body.access_token;
        this.deleteUser(id, token).then((deleteUserResp) => {
          expect(deleteUserResp.status).to.eq(204);
        });
        this.getUser(id, token).then((getUsersResp) => {
          expect(getUsersResp.status).to.eq(404);
        });
      });
  }
}

const userApi = new UserApi();
export default userApi;
