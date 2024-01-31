import { apis, dbIdRegex, tokenAliasName, users } from "../../support/consts";
import { Helper } from "../../support/helper";
import favoriteApi from "../_common/apiPom/favorite/favoriteApi";
import favoritesApi from "../_common/apiPom/favorite/favoritesApi";
import productApi from "../_common/apiPom/product/productApi";
import productsApi from "../_common/apiPom/product/productsApi";
import loginApi from "../_common/apiPom/user/loginApi";
import registerApi from "../_common/apiPom/user/registerApi";
import userApi from "../_common/apiPom/user/userApi";
import usersApi from "../_common/apiPom/user/usersApi";

describe(`${apis.favorites.relativeUrl()}`, () => {
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

  describe("GET favorites", () => {
    it("should get favos of logged in user successfully", () => {
      cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
        // precondition: add some favos to this user
        const product1Name = "combination pliers";
        const product2Name = "Circular Saw";
        favoritesApi.addProductToUserFavos(product1Name, user1Token);
        favoritesApi.addProductToUserFavos(product2Name, user1Token);

        // get favos of this user
        favoritesApi.get(user1Token).then((favosResp) => {
          const favos: object[] = favosResp.body;
          expect(favos).to.be.an("array");
          expect(favos.length).to.eq(2);
          expect(favos[0]["id"]).not.to.eq(favosResp.body[1].id);

          const product1Favo = favos.find(
            (favo) =>
              favo["product"]["name"].trim().toLowerCase() ===
              product1Name.trim().toLowerCase()
          );
          const product2Favo = favos.find(
            (favo) =>
              favo["product"]["name"].trim().toLowerCase() ===
              product2Name.trim().toLowerCase()
          );

          expect(product1Favo).to.be.ok; // truthy
          expect(product2Favo).to.be.ok; // truthy
        });
      });
    });

    it("added product as favo should be same as target product", () => {
      cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
        // precondition: add favo to this user
        const productName = "combination pliers";
        favoritesApi.addProductToUserFavos(productName, user1Token);
        // get target product
        productsApi.getProductId(productName).then((productId) => {
          productApi.get(productId).then((productResp) => {
            const targetProduct = productResp.body;
            // get favos of this user
            favoritesApi.get(user1Token).then((favosResp) => {
              const favos: object[] = favosResp.body;
              expect(favos.length).to.eq(1);

              const partialProduct = Helper.excludeKeys(targetProduct, [
                "brand",
                "category",
              ]);
              expect(favos[0]["product"]).to.deep.eq(partialProduct);
            });
          });
        });
      });
    });

    it("For user1 has favos and user2 has other favos, each user sees only his favos (ownership concept)", () => {
      // precondition: add favos to users
      const product1Name = "combination pliers";
      const product2Name = "Circular Saw";

      //// user1
      loginApi.login(user1.email, user1.password).then((loginResp) => {
        // store token
        cy.wrap(loginResp.body.access_token).as(user1.tokenAliasName);
        favoritesApi.addProductToUserFavos(
          product1Name,
          loginResp.body.access_token
        );
      });

      //// user2
      loginApi.login(user2.email, user2.password).then((loginResp) => {
        // store token
        cy.wrap(loginResp.body.access_token).as(user2.tokenAliasName);
        favoritesApi.addProductToUserFavos(
          product2Name,
          loginResp.body.access_token
        );
      });

      // as user1, GET favos
      cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
        favoritesApi.get(user1Token).then((favosResp) => {
          const favos: object[] = favosResp.body;
          // assert, favos of user1 exist
          expect(
            favos.find(
              (favo) =>
                favo["product"]["name"].trim().toLowerCase() ===
                product1Name.trim().toLowerCase()
            )
          ).to.be.ok; // truthy

          // assert, favos of user2 doNot exist
          expect(
            favos.find(
              (favo) =>
                favo["product"]["name"].trim().toLowerCase() ===
                product2Name.trim().toLowerCase()
            )
          ).to.eq(undefined);
        });
      });

      // as user2, GET favos
      cy.get(`@${user2.tokenAliasName}`).then((user2Token: any) => {
        favoritesApi.get(user2Token).then((favosResp) => {
          const favos: object[] = favosResp.body;
          // assert, favos of user2 exist
          expect(
            favos.find(
              (favo) =>
                favo["product"]["name"].trim().toLowerCase() ===
                product2Name.trim().toLowerCase()
            )
          ).to.be.ok; // truthy

          // assert, favos of user1 doNot exist
          expect(
            favos.find(
              (favo) =>
                favo["product"]["name"].trim().toLowerCase() ===
                product1Name.trim().toLowerCase()
            )
          ).to.eq(undefined);
        });
      });
    });
  });

  describe("POST new favorite", () => {
    it("should add product to favos of logged in user successfully", () => {
      // precondition: get target product id
      productsApi.getAllProducts().then((products) => {
        const productName = "combination pliers";
        const productId = productsApi.search(productName, products);
        if (!productId) {
          throw new Error(`product ${productName} Not found`);
        }
        // add the product to user favos
        cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
          const reqBody = {
            product_id: productId,
          };

          favoritesApi.post(user1Token, reqBody).then((postResp) => {
            expect(postResp.isOkStatusCode).to.eq(true);
            // assert user id
            expect(postResp.body.user_id).to.eq(user1.id);
            // assert product id
            expect(postResp.body.product_id).to.eq(productId);
            // assert favorite id
            const favoId = postResp.body.id;
            expect(favoId).to.match(new RegExp(dbIdRegex));
            favoriteApi.get(favoId, user1Token).then((getResp) => {
              expect(getResp.body.id).to.eq(favoId);
              expect(getResp.body.product_id).to.eq(productId);
            });
          });
        });
      });
    });

    it("when add same product as favo to multi users, each user has a different favo id", () => {
      const productName = "combination pliers";
      let favoRespUser1: Cypress.Response<any>,
        favoRespUser2: Cypress.Response<any>;

      // user1
      loginApi.login(user1.email, user1.password).then((loginResp) => {
        // store token
        cy.wrap(loginResp.body.access_token).as(user1.tokenAliasName);
        favoritesApi
          .addProductToUserFavos(productName, loginResp.body.access_token)
          .then((postResp) => {
            favoRespUser1 = postResp;
          });
      });

      // user2
      loginApi.login(user2.email, user2.password).then((loginResp) => {
        // store token
        cy.wrap(loginResp.body.access_token).as(user2.tokenAliasName);
        favoritesApi
          .addProductToUserFavos(productName, loginResp.body.access_token)
          .then((postResp) => {
            favoRespUser2 = postResp;
          });
      });

      cy.then(() => {
        // assert, same product, but different favo id
        expect(favoRespUser1.body.product_id).to.eq(
          favoRespUser2.body.product_id
        );
        expect(favoRespUser1.body.id).to.not.eq(favoRespUser2.body.id);
      });
    });

    it("should fail with descriptive error msg, upon adding already existing favo", () => {
      // precondition: add product as favo to user
      const productName = "combination pliers";
      cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
        favoritesApi.addProductToUserFavos(productName, user1Token);

        // add same product as favo to same user
        favoritesApi
          .addProductToUserFavos(productName, user1Token)
          .then((postResp) => {
            expect(postResp.status).to.eq(422);
            const respMsg: string = postResp.body.message;
            expect(respMsg.trim().toLowerCase()).to.contain("duplicate entry");
          });
      });
    });

    it("adding favo to user makes him undeletable", () => {
      // precondition: add favo to user
      const productName = "combination pliers";
      cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
        favoritesApi.addProductToUserFavos(productName, user1Token);
      });

      // try to delete user
      loginApi
        .login(users.admin.EMAIL, users.admin.PASSWORD)
        .then((loginResp) => {
          userApi
            .deleteUser(user1.id, loginResp.body.access_token)
            .then((deleteUserResp) => {
              expect(deleteUserResp.status).to.eq(409);
              const respMsg: string = deleteUserResp.body.message;
              expect(respMsg.trim().toLowerCase()).to.contain("used elsewhere");
            });
        });
    });

    it("providing product id is mandatory", () => {
      const reqBody = {};
      cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
        favoritesApi.post(user1Token, reqBody).then((postResp) => {
          expect(postResp.status).to.eq(422);
          const productIdErrors: string[] = postResp.body.product_id;
          expect(productIdErrors).to.be.an("array");
          expect(productIdErrors.length).to.eq(1);
          expect(productIdErrors[0].trim().toLowerCase()).to.contain(
            "field is required"
          );
        });
      });
    });

    it("should fail, if non-existing product id is provided", () => {
      const reqBody = { product_id: "non-existing" };
      cy.get(`@${user1.tokenAliasName}`).then((user1Token: any) => {
        favoritesApi.post(user1Token, reqBody).then((postResp) => {
          expect(postResp.status).to.eq(422);
          const productIdErrors: string[] = postResp.body.product_id;
          expect(productIdErrors).to.be.an("array");
          expect(productIdErrors.length).to.eq(1);
          expect(productIdErrors[0].trim().toLowerCase()).to.contain(
            "product id is invalid"
          );
        });
      });
    });
  });
});
