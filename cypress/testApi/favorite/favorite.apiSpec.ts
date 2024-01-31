import { apis, tokenAliasName } from "../../support/consts";
import { apiHost } from "../../support/cyEnvVar";
import favoriteApi from "../_common/apiPom/favorite/favoriteApi";
import favoritesApi from "../_common/apiPom/favorite/favoritesApi";

import loginApi from "../_common/apiPom/user/loginApi";
import logoutApi from "../_common/apiPom/user/logoutApi";
import registerApi from "../_common/apiPom/user/registerApi";
import usersApi from "../_common/apiPom/user/usersApi";

describe(`${apis.specificFavorite.relativeUrl("{favoriteId}")}`, () => {
  const user1 = {
    email: Cypress.env("UNREGISTERED_CREDENTIALS")["EMAIL"],
    password: Cypress.env("UNREGISTERED_CREDENTIALS")["PASSWORD"],
    tokenAliasName: `user1_${tokenAliasName}`,
    id: "",
  };

  const user2 = {
    email: Cypress.env("UNREGISTERED_CREDENTIALS_2")["EMAIL"],
    password: Cypress.env("UNREGISTERED_CREDENTIALS_2")["PASSWORD"],
    tokenAliasName: `user2_${tokenAliasName}`,
    id: "",
  };

  before(() => {
    // create user1
    cy.then(() => {
      registerApi.registrationData.email = user1.email;
      registerApi.registrationData.password = user1.password;
      registerApi.setUp().then((user1Info) => {
        // store user1 id
        user1.id = user1Info.userId;
      });
    });
    // create user2
    cy.then(() => {
      registerApi.registrationData.email = user2.email;
      registerApi.registrationData.password = user2.password;
      registerApi.setUp().then((user2Info) => {
        // store user2 id
        user2.id = user2Info.userId;
      });
    });
  });

  beforeEach(() => {
    // login as user1
    loginApi.login(user1.email, user1.password).then((loginResp) => {
      // store token
      cy.wrap(loginResp.body.access_token).as(user1.tokenAliasName);
    });
  });

  afterEach(() => {
    // reset registration data
    registerApi.resetRegistrationData();

    // delete favos of user1, if any
    loginApi.login(user1.email, user1.password).then((loginResp) => {
      favoritesApi.cleanUp(loginResp.body.access_token);
    });

    // delete favos of user2, if any
    loginApi.login(user2.email, user2.password).then((loginResp) => {
      favoritesApi.cleanUp(loginResp.body.access_token);
    });
  });

  after(() => {
    // delete created users
    usersApi.cleanUp();
  });

  it("Should return Not allowed, if unsupported http method is used", () => {
    // Precondition: add favo to user
    cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
      const productName = "combination pliers";
    favoritesApi.addProductToUserFavos(productName, user1Token).then((postFavoResp) => {
      const favoId = postFavoResp.body.id
      // request the api with unsupported method (i.e. POST)
      cy.request({
        url: `${apiHost}${apis.specificFavorite.relativeUrl(favoId)}`,
        method: "POST",
        auth: {
          bearer: user1Token,
        },
        failOnStatusCode: false,
      }).then((getFavoResp) => {
        // should return method not allowed
        expect(getFavoResp.status).to.eq(405);
        const errMsg: string = getFavoResp.body.message;
          expect(errMsg.trim().toLowerCase()).to.contain("method is not allowed");
      });
    });
    });
    
  });

  it("Should return unauthorized, if expired token is provided", () => {
    cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
      let user1FavoId: string = undefined;
      // precondition: add favo to user
      const product1Name = "combination pliers";
      favoritesApi
        .addProductToUserFavos(product1Name, user1Token)
        .then((postResp) => {
          // store favo id
          user1FavoId = postResp.body.id;
        });

      // precondition: as logged-in user, logout
      logoutApi.logout(user1Token).then((logoutResp) => {
        expect(logoutResp.isOkStatusCode).to.eq(true);

        // call GET favo api using the expired token
        favoriteApi.get(user1FavoId, user1Token).then((getFavoResp) => {
          // should return unauthorized
          expect(getFavoResp.status).to.eq(401);
          const errMsg: string = getFavoResp.body.message;
          expect(errMsg.trim().toLowerCase()).to.contain("unauthorized");
        });
      });
    });
  });

  describe("GET specific favorite", () => {
    it("for user has favo, user can get this favo by favo id", () => {
      // precondition: add favo to user
      const productName = "combination pliers";
      cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
        favoritesApi
          .addProductToUserFavos(productName, user1Token)
          .then((postFavoResp) => {
            const expectedFavoId = postFavoResp.body.id;
            const expectedProductId = postFavoResp.body.product_id;
            const expectedUserId = postFavoResp.body.user_id;
            // get favo by favo id
            favoriteApi.get(expectedFavoId, user1Token).then((getFavoResp) => {
              expect(getFavoResp.body.id).to.eq(expectedFavoId);
              expect(getFavoResp.body.product_id).to.eq(expectedProductId);
              expect(getFavoResp.body.user_id).to.eq(expectedUserId);
            });
          });
      });
    });

    it("bug - For user1 has favo1 and user2 has favo2, user1 cannot GET favo2 (ownership concept)", () => {
      // I guess, should return not found Or forbidden

      // precondition: add favos to users
      const product1Name = "combination pliers";
      const product2Name = "thor hammer";
      let user1FavoId: string = undefined;
      let user2FavoId: string = undefined;
      //// user1
      loginApi.login(user1.email, user1.password).then((loginResp) => {
        // store token
        cy.wrap(loginResp.body.access_token).as(user1.tokenAliasName);
        favoritesApi
          .addProductToUserFavos(product1Name, loginResp.body.access_token)
          .then((postResp) => {
            // store favo id
            user1FavoId = postResp.body.id;
          });
      });

      //// user2
      loginApi.login(user2.email, user2.password).then((loginResp) => {
        // store token
        cy.wrap(loginResp.body.access_token).as(user2.tokenAliasName);
        favoritesApi
          .addProductToUserFavos(product2Name, loginResp.body.access_token)
          .then((postResp) => {
            // store favo id
            user2FavoId = postResp.body.id;
          });
      });

      // as user1, try to get favo of user2
      cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
        favoriteApi.get(user2FavoId, user1Token).then((getFavoResp) => {
          expect(getFavoResp.status).to.eq(403);
        });
      });
    });
  });

  describe.skip("bug - DELETE favorite", () => {
    // bug: delete favo apis deletes the favo by productId, Not favoId (if you pass favoId, the api returns success, but the favo still exists, but if you pass productId, the api returns success and the favo doesNot exist)

    it("Should delete favo successfully by favo id", () => {
      // precondition: add favo to user
      const productName = "combination pliers";
      cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
        favoritesApi
          .addProductToUserFavos(productName, user1Token)
          .then((postFavoResp) => {
            const favoId = postFavoResp.body.id;

            // before delete favo, it exists
            favoriteApi.get(favoId, user1Token).then((getFavoResp) => {
              expect(getFavoResp.body.id).to.eq(favoId);
            });

            // delete favo by favo id
            favoriteApi.delete(favoId, user1Token).then((deleteFavoResp) => {
              expect(deleteFavoResp.isOkStatusCode).to.eq(true);
            });

            // after delete favo, it doesNot exist
            favoriteApi.get(favoId, user1Token).then((getFavoResp) => {
              expect(getFavoResp.status).to.eq(404);
            });
          });
      });
    });

    it("for multi users having same favorite, deleting this favorite for a user deletes it Only for this user, Not other users (ownership concept)", () => {
      // precondition: 1 favorite exists in 2 users
      // login as user1
      // delete the favorite
      // success (favo doesNot exist)
      // login as user2
      // favo still exists
    });

    it("deleting all favos of user makes him deletable", () => {
      //
    });

    it("For user1 has favo1 and user2 has favo2, user1 cannot delete favo2 (ownership concept)", () => {
      // I guess, should return not found Or forbidden
    });
  });
});
