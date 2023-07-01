import { apis, users } from "../../support/consts";
import loginApi from "../common/apiPom/login/loginApi";
import registerApi from "../common/apiPom/register/registerApi";
import userApi from "../common/apiPom/user/userApi";

describe(`${apis.login.relativeUrl()}`, () => {
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

  it("Should respond with correct status code and body upon providing registered credentials", () => {
    const registeredusers = {
      email: users.customer1.EMAIL,
      password: users.customer1.PASSWORD,
    };

    loginApi
      .login(registeredusers.email, registeredusers.password)
      .then((loginResp) => {
        expect(loginResp.status).to.eq(200);
        expect(Object.keys(loginResp.body)).to.have.lengthOf(3);
        expect(loginResp.body.access_token).to.be.a("string").and.to.be.ok; // ok referes to "truthy"
        expect(loginResp.body.token_type.toLowerCase()).to.eq(
          "Bearer".toLowerCase()
        );
        expect(loginResp.body.expires_in).to.be.a("number").and.to.be.ok;
      });
  });

  it("Should respond correct status code and body upon providing incorrect credentials", () => {
    let registeredEmail: string;
    const incorrectPW = "incorrectPW";
    let userId: number;

    // Register a brand-new user and Not use existing user to avoid making the test sensitive to data change
    registerApi.register(registerApi.registrationData).then((registerResp) => {
      registeredEmail = registerResp.body.email;
      userId = registerResp.body.id;
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

    // Delete the created user as a tear down action
    /* Ideally, a script for clearing test data from the database should be executed in a beforeEach hook, but
   as this automation project uses a deployed (Not local) version of the SUT, a workaround is used to avoid flakiness*/
    loginApi
      .login(users.admin.EMAIL, users.admin.PASSWORD)
      .then((loginResp) => {
        const token = loginResp.body.access_token;

        userApi.deleteUser(userId, token).then((deleteUserResp) => {
          expect(deleteUserResp.status).to.eq(204);
        });

        // Make sure user is deleted
        userApi.getUser(userId, token).then((getUsersResp) => {
          expect(getUsersResp.status).to.eq(404);
        });
      });
  });

  it("Should lock accuont upon making multiple failed login attempts", () => {
    const failedAttempts = 3;
    let registeredEmail: string;
    let incorrectPW: "incorrectPW";
    let userId: number;

    registerApi.register(registerApi.registrationData).then((registerResp) => {
      registeredEmail = registerResp.body.email;
      userId = registerResp.body.id;
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

    // Tear down
    loginApi
      .login(users.admin.EMAIL, users.admin.PASSWORD)
      .then((loginResp) => {
        const token = loginResp.body.access_token;
        userApi.deleteUser(userId, token).then((deleteUserResp) => {
          expect(deleteUserResp.status).to.eq(204);
        });
        userApi.getUser(userId, token).then((getUsersResp) => {
          expect(getUsersResp.status).to.eq(404);
        });
      });
  });
});
