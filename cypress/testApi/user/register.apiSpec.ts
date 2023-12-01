import { apis } from "../../support/consts";
import registerApi from "../_common/apiPom/user/registerApi";
import usersApi from "../_common/apiPom/user/usersApi";

describe(`${apis.register.relativeUrl()}`, () => {
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

  it("Should Not register already registered emails", () => {
    let userId: string;

    // Precondition
    registerApi.setUp().then((userInfo) => {
      userId = userInfo.userId;

      cy.log("id ", userId);
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
  });

  it("bug - Should Not register a user without filling required data", () => {
    for (let key in registerApi.registrationData) {
      // reset to default
      registerApi.resetRegistrationData();
      // change property, that is needed in this iteration
      registerApi.registrationData[key] = "";

      registerApi
        .register(registerApi.registrationData)
        .then((registerResp) => {
          expect(registerResp.status).to.eq(422);
          const respBodyPropertyName = Object.keys(registerResp.body)[0];
          const field = respBodyPropertyName.replace(/_/g, "-");
          expect(registerResp.body[key]).to.deep.eq([
            `The ${field} field is required.`,
          ]);
        });
    }

    // Cleanup
    registerApi.resetRegistrationData();
  });
});
