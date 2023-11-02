import { apis, tokenAliasName, users } from "../../support/consts";
import loginApi from "../_common/apiPom/user/loginApi";
import registerApi from "../_common/apiPom/user/registerApi";
import usersApi from "../_common/apiPom/user/usersApi";
import changePwApi from "../_common/apiPom/user/changePwApi";

describe(`${apis.changePW.relativeUrl()}`, () => {
  before(() => {
    cy.log("before all tests in this suite");
  });

  beforeEach(() => {
    usersApi.cleanUp();
    changePwApi.setup().as(tokenAliasName);
  });

  afterEach(() => {
    cy.log("after each test in this suite");
  });

  after(() => {
    cy.log("after all tests in this suite");
  });

  it("bug - Should respond with success, upon providing correct current pw, same data in new pw and repeat pw", () => {
    // Prepare request body
    cy.then(() => {
      changePwApi.requestBody.current_password =
        registerApi.registrationData.password;
      changePwApi.requestBody.new_password = changePwApi.newPW;
      changePwApi.requestBody.new_password_confirmation = changePwApi.newPW;
    });

    // change pw
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      changePwApi
        .changePW(token, changePwApi.requestBody)
        .then((changePwResp) => {
          expect(changePwResp.status).to.eq(200);
          expect(changePwResp.body.success).to.eq(true);
        });
    });
  });

  it("Should throw error, upon providing wrong current pw", () => {
    // Prepare request body
    cy.then(() => {
      changePwApi.requestBody.current_password = "wrongCurrentPW01";
      changePwApi.requestBody.new_password = changePwApi.newPW;
      changePwApi.requestBody.new_password_confirmation = changePwApi.newPW;
    });

    // change pw
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      changePwApi
        .changePW(token, changePwApi.requestBody)
        .then((changePwResp) => {
          expect(changePwResp.status).to.eq(400);
          expect(changePwResp.body.success).to.eq(false);
          expect(changePwResp.body.message).to.match(
            /current password(.*)not match/
          );
        });
    });
  });

  it("bug - Should throw error, upon providing different new pw and repeat pw", () => {
    // Prepare request body
    cy.then(() => {
      changePwApi.requestBody.current_password =
        registerApi.registrationData.password;
      changePwApi.requestBody.new_password = changePwApi.newPW;
      changePwApi.requestBody.new_password_confirmation = "wrongRepeatPW";
    });

    // change pw
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      changePwApi
        .changePW(token, changePwApi.requestBody)
        .then((changePwResp) => {
          expect(changePwResp.status).to.eq(422);
          expect(changePwResp.body.message).to.match(
            /new password(.*)confirmation(.*)not match/
          );
        });
    });
  });

  it("bug - Should throw error, upon missing a property (i.e. new pw) from request body", () => {
    // Prepare request body
    const body = {
      current_password: registerApi.registrationData.password,
      new_password_confirmation: changePwApi.newPW,
    };

    // change pw
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      changePwApi.changePW(token, body).then((changePwResp) => {
        expect(changePwResp.status).to.eq(422);
        expect(changePwResp.body.message).to.match(/new password(.*)required/);
      });
    });
  });

  it("Should throw error, if user is Not authenticated", () => {
    // Prepare request body
    cy.then(() => {
      changePwApi.requestBody.current_password = users.customer1.PASSWORD;
      changePwApi.requestBody.new_password = changePwApi.newPW;
      changePwApi.requestBody.new_password_confirmation = changePwApi.newPW;
    });

    changePwApi.changePW("", changePwApi.requestBody).then((changePwResp) => {
      expect(changePwResp.status).to.eq(401);
      const errorMsg: string = changePwResp.body.message;
      const errMsgLower = errorMsg.toLowerCase();
      expect(errMsgLower).to.match(/unauthorized/);
    });
  });

  it("bug - Should Not allow login with old pw", () => {
    // Prepare request body
    cy.then(() => {
      changePwApi.requestBody.current_password =
        registerApi.registrationData.password;
      changePwApi.requestBody.new_password = changePwApi.newPW;
      changePwApi.requestBody.new_password_confirmation = changePwApi.newPW;
    });

    // change pw
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      changePwApi
        .changePW(token, changePwApi.requestBody)
        .then((changePwResp) => {
          expect(changePwResp.status).to.eq(200);
        });
    });

    // login with old pw
    loginApi
      .login(
        registerApi.registrationData.email,
        registerApi.registrationData.password
      )
      .then((loginResp) => {
        expect(loginResp.status).to.eq(401);
      });
  });

  it("bug - Should allow login with new pw", () => {
    // Prepare request body
    cy.then(() => {
      changePwApi.requestBody.current_password =
        registerApi.registrationData.password;
      changePwApi.requestBody.new_password = changePwApi.newPW;
      changePwApi.requestBody.new_password_confirmation = changePwApi.newPW;
    });

    // change pw
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      changePwApi
        .changePW(token, changePwApi.requestBody)
        .then((changePwResp) => {
          expect(changePwResp.status).to.eq(200);
        });
    });

    // login with new pw
    loginApi
      .login(registerApi.registrationData.email, changePwApi.newPW)
      .then((loginResp) => {
        expect(loginResp.status).to.eq(200);
        expect(loginResp.body.access_token).to.be.a("string").and.to.be.ok; // ok refers to "truthy"
      });
  });
});
