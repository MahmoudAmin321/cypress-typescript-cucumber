import { apis } from "../../support/consts";
import { apiHost } from "../../support/cyEnvVar";
import forgotPwApi from "../_common/apiPom/user/forgotPwApi";
import loginApi from "../_common/apiPom/user/loginApi";
import registerApi from "../_common/apiPom/user/registerApi";
import usersApi from "../_common/apiPom/user/usersApi";

describe(`${apis.forgotPW.relativeUrl()}`, () => {
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

  it("Should respond with success, upon providing registered email", () => {
    let email: string;
    let userId: string;

    // precondition
    registerApi.setUp().then((userInfo) => {
      email = userInfo.registeredEmail;
      userId = userInfo.userId;
    });

    cy.then(() => {
      cy.request({
        url: `${apiHost}${apis.forgotPW.relativeUrl()}`,
        method: "POST",
        body: { email },
      }).then((forgotPwResp) => {
        expect(forgotPwResp.status).equal(200);
        expect(forgotPwResp.body.success).to.equal(true);
      });
    });
  });

  it("bug - Should reset pw to default value", () => {
    let userId: string;

    // precondition: register user with pw other than welcome01
    registerApi.registrationData.password = "different01";
    const register = registerApi.setUp();
    register.then((userInfo) => {
      userId = userInfo.userId;
    });

    // login with this user -> should be successful
    cy.then(() => {
      loginApi
        .login(
          registerApi.registrationData.email,
          registerApi.registrationData.password
        )
        .then((loginResp) => {
          expect(loginResp.status).to.eq(200);
          expect(loginResp.body.access_token).to.be.a("string").and.to.be.ok; // ok refers to "truthy"
        });
    });

    // reset pw
    forgotPwApi.resetPw(registerApi.registrationData.email);

    // login with old pw -> should Not be successful
    cy.then(() => {
      loginApi
        .login(
          registerApi.registrationData.email,
          registerApi.registrationData.password
        )
        .then((loginResp) => {
          expect(loginResp.status).to.eq(401);
        });
    });

    // login with new pw -> should be successful
    cy.then(() => {
      registerApi.resetRegistrationData();
    });
    cy.then(() => {
      loginApi
        .login(
          registerApi.registrationData.email,
          registerApi.registrationData.password
        )
        .then((loginResp) => {
          expect(loginResp.status).to.eq(200);
          expect(loginResp.body.access_token).to.be.a("string").and.to.be.ok; // ok refers to "truthy"
        });
    });
  });
});
