import { apis, tokenAliasName, users } from "../../support/consts";
import loginApi from "../_common/apiPom/user/loginApi";
import registerApi from "../_common/apiPom/user/registerApi";
import usersApi from "../_common/apiPom/user/usersApi";
import usersSearchApi from "../_common/apiPom/user/usersSearchApi";

describe(`${apis.usersSearch.relativeUrl()}`, () => {
  before(() => {
    usersApi.cleanUp();
  });

  beforeEach(() => {
    loginApi
      .login(users.admin.EMAIL, users.admin.PASSWORD)
      .then((loginResp) => {
        // store token
        cy.wrap(loginResp.body.access_token).as(tokenAliasName);
      });
  });

  afterEach(() => {
    usersApi.cleanUp();
    registerApi.resetRegistrationData();
  });

  after(() => {
    cy.log("after all tests in this suite");
  });

  it("Should search by first name", () => {
    const firstName = "is a fn";

    // precondition: register multiple users
    cy.then(() => {
      registerApi.registrationData.first_name = firstName;
      registerApi.registrationData.email = "fn1@test.test";
      registerApi.setUp();
    });

    cy.then(() => {
      registerApi.registrationData.first_name = firstName;
      registerApi.registrationData.email = "fn2@test.test";
      registerApi.setUp();
    });

    cy.get(`@${tokenAliasName}`).then((token: any) => {
      usersSearchApi.search(token, firstName).then((usersSearchResp) => {
        expect(usersSearchResp.status).equal(200);
        expect(usersSearchResp.body.data).to.be.an("array");
        expect(usersSearchResp.body.data.length).to.eq(2);
        expect(usersSearchResp.body.data[0].first_name).to.eq(firstName);
        expect(usersSearchResp.body.data[1].first_name).to.eq(firstName);
      });
    });
  });

  it("Should search by last name", () => {
    const lastName = "is a ln";

    // precondition: register user
    cy.then(() => {
      registerApi.registrationData.last_name = lastName;
      registerApi.registrationData.email = "ln1@test.test";
      registerApi.setUp();
    });

    cy.get(`@${tokenAliasName}`).then((token: any) => {
      usersSearchApi.search(token, lastName).then((usersSearchResp) => {
        expect(usersSearchResp.status).equal(200);
        expect(usersSearchResp.body.data).to.be.an("array");
        expect(usersSearchResp.body.data.length).to.eq(1);
        expect(usersSearchResp.body.data[0].last_name).to.eq(lastName);
      });
    });
  });

  it("Should search by city", () => {
    const city = "is a city";

    // precondition: register user
    cy.then(() => {
      registerApi.registrationData.city = city;
      registerApi.registrationData.email = "city1@test.test";
      registerApi.setUp();
    });

    cy.get(`@${tokenAliasName}`).then((token: any) => {
      usersSearchApi.search(token, city).then((usersSearchResp) => {
        expect(usersSearchResp.status).equal(200);
        expect(usersSearchResp.body.data).to.be.an("array");
        expect(usersSearchResp.body.data.length).to.eq(1);
        expect(usersSearchResp.body.data[0].city).to.eq(city);
      });
    });
  });

  it("Should return No data, if search value doesn't exist", () => {
    const city = "is a city";
    const nonExitingCity = "doesn't exist";

    // precondition: register user
    cy.then(() => {
      registerApi.registrationData.city = city;
      registerApi.registrationData.email = "city1@test.test";
      registerApi.setUp();
    });

    cy.get(`@${tokenAliasName}`).then((token: any) => {
      usersSearchApi.search(token, nonExitingCity).then((usersSearchResp) => {
        expect(usersSearchResp.status).equal(200);
        expect(usersSearchResp.body.data).deep.eq([]);
      });
    });
  });

  it("Search should be case-insensitive", () => {
    const city = "is a city";

    // precondition: register user
    cy.then(() => {
      registerApi.registrationData.city = city;
      registerApi.registrationData.email = "city1@test.test";
      registerApi.setUp();
    });

    cy.get(`@${tokenAliasName}`).then((token: any) => {
      usersSearchApi
        .search(token, city.toUpperCase())
        .then((usersSearchResp) => {
          expect(usersSearchResp.status).equal(200);
          expect(usersSearchResp.body.data.length).to.eq(1);
          expect(usersSearchResp.body.data[0].city).to.eq(city);
        });
    });
  });

  it("Search should allow starts with", () => {
    const city = "is a city";

    // precondition: register user
    cy.then(() => {
      registerApi.registrationData.city = city;
      registerApi.registrationData.email = "city1@test.test";
      registerApi.setUp();
    });

    cy.get(`@${tokenAliasName}`).then((token: any) => {
      usersSearchApi
        .search(token, city.substring(0, city.length - 3))
        .then((usersSearchResp) => {
          expect(usersSearchResp.status).equal(200);
          expect(usersSearchResp.body.data.length).to.eq(1);
          expect(usersSearchResp.body.data[0].city).to.eq(city);
        });
    });
  });

  it("Search should allow contains", () => {
    const city = "is a city";

    // precondition: register user
    cy.then(() => {
      registerApi.registrationData.city = city;
      registerApi.registrationData.email = "city1@test.test";
      registerApi.setUp();
    });

    cy.get(`@${tokenAliasName}`).then((token: any) => {
      usersSearchApi
        .search(token, city.substring(3))
        .then((usersSearchResp) => {
          expect(usersSearchResp.status).equal(200);
          expect(usersSearchResp.body.data.length).to.eq(1);
          expect(usersSearchResp.body.data[0].city).to.eq(city);
        });
    });
  });

  it("bug - Should return No data, upon searching for other value than fn, ln Or city", () => {
    // precondition: register user
    cy.then(() => {
      registerApi.setUp();
    });

    cy.get(`@${tokenAliasName}`).then((token: any) => {
      usersSearchApi
        .search(token, registerApi.registrationData.email)
        .then((usersSearchResp) => {
          expect(usersSearchResp.status).equal(200);
          expect(usersSearchResp.body.data).deep.eq([]);
        });
    });
  });

  it("Should return unauthorized, if No valid token provided", () => {
    const invalidToken = "";
    const city = "is a city";

    // precondition: register user
    cy.then(() => {
      registerApi.registrationData.city = city;
      registerApi.registrationData.email = "city1@test.test";
      registerApi.setUp();
    });

    usersSearchApi.search(invalidToken, city).then((usersSearchResp) => {
      expect(usersSearchResp.status).to.equal(401);
      expect(usersSearchResp.body.message).to.equal("Unauthorized");
    });
  });

  it("bug - Should return forbidden, if unauthorized user is trying to search", () => {
    const city = "is a city";

    // precondition: register user
    cy.then(() => {
      registerApi.registrationData.city = city;
      registerApi.registrationData.email = "city1@test.test";
      registerApi.setUp();
    });

    // login as customer (Not admin)
    loginApi
      .login(users.customer2.EMAIL, users.customer2.PASSWORD)
      .then((loginResp) => {
        const customerToken = loginResp.body.access_token;
        // try to search
        usersSearchApi.search(customerToken, city).then((usersSearchResp) => {
          expect(usersSearchResp.status).to.eq(403);
          expect(usersSearchResp.body.message.toLowerCase()).to.contain(
            "forbidden"
          );
        });
      });
  });
});
