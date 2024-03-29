import { apis, tokenAliasName, users } from "../../support/consts";

import currentUserApi from "../_common/apiPom/user/currentUserApi";
import loginApi from "../_common/apiPom/user/loginApi";
import registerApi from "../_common/apiPom/user/registerApi";
import userApi from "../_common/apiPom/user/userApi";
import usersApi from "../_common/apiPom/user/usersApi";

describe(`${apis.currentUser.relativeUrl()}`, () => {
  before(() => {
    cy.log("before all tests in this suite");
  });

  beforeEach(() => {
    cy.log("before each test in this suite");
  });

  afterEach(() => {
    cy.log("after each test in this suite");
  });

  after(() => {
    cy.log("after all tests in this suite");
  });

  it("Should get current user", () => {
    const userEmail = users.customer2.EMAIL;

    let adminToken = "";
    loginApi
      .login(users.admin.EMAIL, users.admin.PASSWORD)
      .then((loginResp) => {
        // store token
        adminToken = loginResp.body.access_token;
      });

    // get expected info of target user
    cy.then(() => {
      usersApi.getUsers(adminToken).then((usersResp) => {
        for (let i = 0; i < usersResp.body.data.length; i++) {
          const userInfo = usersResp.body.data[i];
          if (userInfo["email"].toLowerCase() == userEmail) {
            // store expected info of target user
            cy.wrap(userInfo).as(currentUserApi.userInfoAliasName);
          }
        }
      });
    });

    // login as target user
    loginApi
      .login(users.customer2.EMAIL, users.customer2.PASSWORD)
      .then((loginResp) => {
        // store token
        cy.wrap(loginResp.body.access_token).as(tokenAliasName);
      });

    // get actual current user info (/me)
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      currentUserApi.getCurrentUser(token).then((currentUserResp) => {
        cy.get(`@${currentUserApi.userInfoAliasName}`).then(
          (expectedUserInfo: any) => {
            // assert
            expect(expectedUserInfo).to.contain.keys(currentUserResp.body);

            for (const key in currentUserResp.body) {
              // skip comparison with unique properties
              if (
                key.trim().toLowerCase() in ["enabled", "failed_login_attempts"]
              ) {
                continue;
              }
              expect(currentUserResp.body[key]).to.equal(expectedUserInfo[key]);
            }
          }
        );
      });
    });
  });

  it("Should get user info, if current user is Not a customer", () => {
    loginApi
      .login(users.admin.EMAIL, users.admin.PASSWORD)
      .then((loginResp) => {
        // store token
        cy.wrap(loginResp.body.access_token).as(tokenAliasName);
      });

    cy.get(`@${tokenAliasName}`).then((token: any) => {
      currentUserApi.getCurrentUser(token).then((currentUserResp) => {
        expect(currentUserResp.status).to.eq(200);
        expect(currentUserResp.body["email"]).to.eq(users.admin.EMAIL);
      });
    });
  });

  it("Should return unauthorized, if No valid token provided", () => {
    const invalidToken = "";

    currentUserApi.getCurrentUser(invalidToken).then((currentUserResp) => {
      expect(currentUserResp.status).to.equal(401);
      expect(currentUserResp.body.message).to.equal("Unauthorized");
    });
  });
});
