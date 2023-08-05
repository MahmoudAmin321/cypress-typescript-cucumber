import { apis, tokenAliasName, users } from "../../support/consts";
import { apiHost } from "../../support/cyEnvVar";
import helper from "../../support/helper";
import loginApi from "../_common/apiPom/user/loginApi";
import usersApi from "../_common/apiPom/user/usersApi";

describe(`${apis.users.relativeUrl()}`, () => {
  before(() => {
    cy.log("before all tests in this suite");
  });

  beforeEach(() => {
    usersApi.cleanUp();

    loginApi
      .login(users.admin.EMAIL, users.admin.PASSWORD)
      .then((loginResp) => {
        // store token
        cy.wrap(loginResp.body.access_token).as(tokenAliasName);
      });
  });

  afterEach(() => {
    cy.log("after each test in this suite");
  });

  after(() => {
    cy.log("after all tests in this suite");
  });

  it("Should get all users", () => {
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      usersApi.getUsers(token).then((usersResp) => {
        expect(usersResp.status).equal(200);
        expect(usersResp.body.data).to.be.an("array").and.not.to.be.empty;

        // Assert, that any (randomly selected) object in the response array has the correct properties
        const randomIndex = helper.getRandomInteger(
          0,
          usersResp.body.data.length - 1
        );
        expect(usersResp.body.data[randomIndex])
          .to.be.an("object")
          .and.to.include.all.keys(
            "first_name",
            "last_name",
            "address",
            "city",
            "state",
            "country",
            "postcode",
            "phone",
            "dob",
            "email",
            "id"
          );
      });
    });
  });

  it("Should return Not allowed, if other HTTP method than GET is used", () => {
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      cy.request({
        url: `${apiHost}${apis.users.relativeUrl()}`,
        method: "POST",
        auth: {
          bearer: token,
        },
        failOnStatusCode: false,
      }).then((usersResp) => {
        expect(usersResp.status).equal(405);
        expect(usersResp.body.message).to.include("not allowed");
      });
    });
  });

  it("Should return unauthorized, if No valid token provided", () => {
    const invalidToken = "";
    usersApi.getUsers(invalidToken).then((usersResp) => {
      expect(usersResp.body.message).to.equal("Unauthorized");
    });
  });
});
