import { apis, users } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { UserInfo } from "../../../../support/models/userInfo";
import { BaseAPI } from "../base.apiPom";
import loginApi from "./loginApi";
import userApi from "./userApi";

class UsersApi extends BaseAPI {
  getUsers(
    token: string,
    pageNr = 1
  ): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.users.relativeUrl()}?page=${pageNr}`,
      auth: {
        bearer: token,
      },
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

    // delete all users except for the built-in ones.
    cy.then(() => {
      const usersToBeKept: string[] = Object.values(users).map(
        (user: UserInfo) => user.EMAIL
      );

      usersApi.getUsers(adminToken).then((usersResp) => {
        const lastPage: number = usersResp.body.last_page;

        for (let pageNr = 1; pageNr <= lastPage; pageNr++) {
          usersApi.getUsers(adminToken, pageNr).then((usersResp) => {
            const users: object[] = usersResp.body.data;

            users.forEach((user) => {
              if (!usersToBeKept.includes(user["email"])) {
                userApi.deleteUser(user["id"], adminToken);
              }
            });
          });
        }
      });
    });
  }
}

const usersApi = new UsersApi();
export default usersApi;
