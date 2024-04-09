import { apis, tokenAliasName, users } from "../../support/consts";
import loginApi from "../_common/apiPom/user/loginApi";
import logoutApi from "../_common/apiPom/user/logoutApi";

describe(`${apis.logout.relativeUrl()}`, () => {
  before(() => {
    cy.log("before all tests in this suite");
  });

  beforeEach(() => {
    loginApi
      .login(users.customer2.EMAIL, users.customer2.PASSWORD)
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

  it("bug - Should destroy the provided valid token", () => {
        
    
        // logout (destroy the token)
        cy.get(`@${tokenAliasName}`).then((token: any) => {
         logoutApi.logout(token).then((logoutResp) => {
            expect(logoutResp.status).to.eq(200);
          });
        });
    
        // make any request using the destroyed token
        cy.get(`@${tokenAliasName}`).then((token: any) => {
          logoutApi.logout(token).then((logoutResp) => {
            expect(logoutResp.status).to.eq(401);
          });
        });
  });

  it("Should respond with not allowed, if the method is other than GET", () => {
    cy.get(`@${tokenAliasName}`).then((token: any)=>{
      logoutApi.logout(token, "POST").then((logoutResp)=> {
        expect(logoutResp.status).to.eq(405);
        expect(logoutResp.body.message).to.include("not allowed");
      })
    })
  });

  it("Should respond with unauthorized, upon providing invalid token", () => {
    const invalidToken = ""
    logoutApi.logout(invalidToken).then((logoutResp) => {
      expect(logoutResp.status).to.eq(401);
      expect(logoutResp.body.message).to.include("Unauthorized");
    });
  });
});
