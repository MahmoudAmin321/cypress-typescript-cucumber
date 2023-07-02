import { apis } from "../../support/consts";
import registerApi from "../common/apiPom/user/registerApi";
import userApi from "../common/apiPom/user/userApi";

describe(`${apis.register.relativeUrl()}`, () => {
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

  it("Should Not register already registered emails", () => {
    let userId: number;

    // Precondition
    registerApi.setUp().then((userInfo) => {
      userId = userInfo.userId;
    });

    cy.then(() => {
      registerApi
        .register(registerApi.registrationData)
        .then((registerResp) => {
          expect(registerResp.status).to.eq(422);
          expect(registerResp.body.email).to.deep.eq([
            "A customer with this email address already exists.",
          ]);
        });
    });

    // Cleanup
    cy.then(() => {
      userApi.cleanUp(userId);
    });
  });

  it("Should Not register a user without filling required data", () => {
    let userId: number;

    for (let key in registerApi.registrationData) {
      // reset to default
      registerApi.resetReistrationData();
      // change property, that is needed in this iteration
      registerApi.registrationData[key] = "";

      registerApi
        .register(registerApi.registrationData)
        .then((registerResp) => {
          expect(registerResp.status).to.eq(422);
          const respBodyPropertyName = Object.keys(registerResp.body)[0];
          const field = respBodyPropertyName.replace("_", " ");
          expect(registerResp.body[key]).to.deep.eq([
            `The ${field} field is required.`,
          ]);
        });
    }

    // Cleanup
    registerApi.resetReistrationData();
  });
});
