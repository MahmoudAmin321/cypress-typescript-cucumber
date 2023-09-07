import { apis, tokenAliasName, users } from "../../support/consts";
import loginApi from "../_common/apiPom/user/loginApi";
import refreshTokenApi from "../_common/apiPom/user/refreshTokenApi";
import usersApi from "../_common/apiPom/user/usersApi";

describe(`${apis.refreshToken.relativeUrl()}`, () => {
  before(() => {
    cy.log("before all tests in this suite");
  });

  beforeEach(() => {
    loginApi
      .login(users.admin.EMAIL, users.customer2.PASSWORD)
      .then((loginResp) => {
        cy.wrap(loginResp.body.access_token).as(tokenAliasName);
      });
  });

  afterEach(() => {
    cy.log("after each test in this suite");
  });

  after(() => {
    cy.log("after all tests in this suite");
  });

  it("Should destroy current token and generate new one", () => {
    // trigger the refresh token request
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      refreshTokenApi.refreshToken(token).then((newTokenResp) => {
        // assert, a new token is generated and is valid (can be used to make any request)
        expect(newTokenResp.status).to.eq(200);
        const newToken = newTokenResp.body.access_token;
        usersApi.getUsers(newToken).then((resp) => {
          expect(resp.status).to.eq(200);
        });

        // assert, old token is destroyed (not valid any more. Cannot be used to make any request)
        usersApi.getUsers(token).then((oldTokenResp) => {
          expect(oldTokenResp.status).to.eq(401);
        });
      });
    });
  });

  it("Should respond with not allowed, if the method is other than GET", () => {
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      refreshTokenApi.refreshToken(token, "POST").then((refreshTokenResp) => {
        expect(refreshTokenResp.status).to.eq(405);
        expect(refreshTokenResp.body.message).to.include("not allowed");
      });
    });
  });

  it("Should respond with unauthorized, upon providing invalid token", () => {
    const invalidToken = "invalid token";
    refreshTokenApi.refreshToken(invalidToken).then((refreshTokenResp) => {
      expect(refreshTokenResp.status).to.eq(401);
      expect(refreshTokenResp.body.message).to.include("Unauthorized");
    });
  });
});
