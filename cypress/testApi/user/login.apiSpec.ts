import { apis, users } from "../../support/consts";
import loginApi from "../_common/apiPom/user/loginApi";
import registerApi from "../_common/apiPom/user/registerApi";
import usersApi from "../_common/apiPom/user/usersApi";

describe(`${apis.login.relativeUrl()}`, () => {
  before(() => {
    cy.log("before all tests in this suite");
  });

  beforeEach(() => {
    usersApi.cleanUp();
  });

  afterEach(() => {
    cy.log("after each test in this suite");
  });

  after(() => {
    cy.log("after all tests in this suite");
  });

  it("Should respond with correct status code and body upon providing registered credentials", () => {
    loginApi
      .login(users.customer1.EMAIL, users.customer1.PASSWORD)
      .then((loginResp) => {
        expect(loginResp.status).to.eq(200);
        expect(Object.keys(loginResp.body)).to.have.lengthOf(3);
        expect(loginResp.body.access_token).to.be.a("string").and.to.be.ok; // ok refers to "truthy"
        expect(loginResp.body.token_type.toLowerCase()).to.eq(
          "Bearer".toLowerCase()
        );
        expect(loginResp.body.expires_in).to.be.a("number").and.to.be.ok;
      });
  });

  it("Should respond correct status code and body upon providing incorrect credentials", () => {
    let registeredEmail: string;
    const incorrectPW = "incorrectPW";
    let userId: string;

    // As precondition, Register a brand-new user and Not use existing user to avoid making the test sensitive to data change
    registerApi.setUp().then((userInfo) => {
      registeredEmail = userInfo.registeredEmail;
      userId = userInfo.userId;
    });

    // Without cy.then(), registeredEmail value will be undefined -> https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Mixing-Async-and-Sync-code
    cy.then(() => {
      loginApi.login(registeredEmail, incorrectPW).then((loginResp) => {
        expect(loginResp.status).to.eq(401);
        expect(Object.keys(loginResp.body)).to.have.lengthOf(1);
        expect(loginResp.body.error.toLowerCase()).to.eq(
          "Unauthorized".toLowerCase()
        );
      });
    });
  });

  it("Should lock account upon making multiple failed login attempts", () => {
    const failedAttempts = 3;
    let registeredEmail: string;
    let incorrectPW: "incorrectPW";
    let userId: string;

    // Precondition
    registerApi.setUp().then((userInfo) => {
      registeredEmail = userInfo.registeredEmail;
      userId = userInfo.userId;
    });

    // reach max. allowed number of failed attempt
    // Without cy.then(), registeredEmail value will be undefined -> https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Mixing-Async-and-Sync-code
    cy.then(() => {
      for (let i = 0; i < failedAttempts; i++) {
        loginApi.login(registeredEmail, incorrectPW).then((loginResp) => {
          expect(loginResp.status).to.eq(401);
        });
      }
    });

    cy.then(() => {
      loginApi.login(registeredEmail, incorrectPW).then((loginResp) => {
        expect(loginResp.status).to.eq(423);
        const expectedErrMsg =
          "Account locked, too many failed attempts. Please contact the administrator.".toLowerCase();
        expect(loginResp.body.error.toLowerCase()).to.contain(expectedErrMsg);
      });
    });
  });
});
