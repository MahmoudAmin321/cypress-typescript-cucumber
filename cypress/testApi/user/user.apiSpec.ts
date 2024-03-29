import { apis, tokenAliasName, users } from "../../support/consts";
import { apiHost } from "../../support/cyEnvVar";
import loginApi from "../_common/apiPom/user/loginApi";
import registerApi from "../_common/apiPom/user/registerApi";
import userApi from "../_common/apiPom/user/userApi";
import usersApi from "../_common/apiPom/user/usersApi";

describe(`${apis.specificUser.relativeUrl("{userId}")}`, () => {
  before(() => {
    cy.log("before all tests in this suite");
  });

  beforeEach(() => {
    usersApi.cleanUp();
    userApi.resetUserData();

    loginApi
      .login(users.admin.EMAIL, users.admin.PASSWORD)
      .then((loginResp) => {
        // store token
        cy.wrap(loginResp.body.access_token).as(tokenAliasName);
      });

    // store a user (i.e. 1st user)
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      usersApi.getUsers(token).then((usersResp) => {
        cy.wrap(usersResp.body.data[0]).as(userApi.userAliasName);
      });
    });
  });

  afterEach(() => {
    cy.log("after each test in this suite");
  });

  after(() => {
    usersApi.cleanUp();
    userApi.resetUserData();
  });

  it("Should get user by id", () => {
    // get 1st user by id
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      cy.get(`@${userApi.userAliasName}`).then((user: any) => {
        userApi.getUser(user["id"], token).then((userResp) => {
          // 1st user should equal stored 1st user
          expect(userResp.body).to.have.all.keys(user);
          for (const key in user) {
            expect(userResp.body[key]).to.equal(user[key]);
          }
        });
      });
    });
  });

  it("Should return Not allowed, if unsupported http method is used", () => {
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      cy.get(`@${userApi.userAliasName}`).then((user: any) => {
        cy.request({
          url: `${apiHost}${apis.specificUser.relativeUrl(user["id"])}`,
          method: "POST",
          auth: {
            bearer: token,
          },
          failOnStatusCode: false,
        }).then((userResp) => {
          expect(userResp.status).to.eq(405);
        });
      });
    });
  });

  it("Should return unauthorized, if No valid token provided", () => {
    const invalidToken = "";
    cy.get(`@${userApi.userAliasName}`).then((user: any) => {
      userApi.getUser(user["id"], invalidToken).then((userResp) => {
        expect(userResp.status).to.equal(401);
        expect(userResp.body.message).to.equal("Unauthorized");
      });
    });
  });

  it("Should return not found, if non-existing user id is provided", () => {
    const nonExistingUserId = "xyz123";
    cy.get(`@${tokenAliasName}`).then((token: any) => {
      userApi.getUser(nonExistingUserId, token).then((userResp) => {
        const respMsg = userResp.body.message.toLowerCase();
        expect(userResp.status).to.equal(404);
        expect(respMsg).to.contain("not found");
      });
    });
  });

  it("Should update user, if valid data is provided", () => {
    // precondition: register new user
    registerApi.setUp().then((userInfo) => {
      cy.get(`@${tokenAliasName}`).then((token: any) => {
        // update user
        userApi
          .updateUser(userInfo.userId, token, userApi.userData)
          .then((updateUserResp) => {
            expect(updateUserResp.status).to.eq(200);
            expect(updateUserResp.body.success).to.eq(true);
          });

        // assert user is updated correctly
        userApi.getUser(userInfo.userId, token).then((getUserResp) => {
          const excludedKeys = [
            "id",
            "created_at",
            "enabled", 
            "failed_login_attempts",
            "provider",
          ];

          for (const key in getUserResp.body) {
            
            // skip properties, that don't exist in both objects
            if (
              excludedKeys.includes(key)
            ) {
              continue;
            }

            if (key == "phone") {
              const expectedPhone = userApi.userData[key];
              expect(getUserResp.body[key]).to.equal(expectedPhone);
              continue;
            }

            expect(getUserResp.body[key]).to.equal(userApi.userData[key]);
          }
        });
      });
    });
  });

  it("Update user should fail, if the new email already exists", () => {
    // precondition: set user data email to an already existing one
    cy.get(`@${userApi.userAliasName}`).then((user: any) => {
      userApi.userData.email = user.email;
    });

    // precondition: register new user
    registerApi.setUp().then((userInfo) => {
      cy.get(`@${tokenAliasName}`).then((token: any) => {
        // update user
        userApi
          .updateUser(userInfo.userId, token, userApi.userData)
          .then((updateUserResp) => {
            expect(updateUserResp.status).to.eq(422);
            expect(updateUserResp.body.message.toLowerCase()).to.eq(
              "duplicate entry"
            );
          });
      });
    });
  });

  it("Update user should fail, if invalid data is provided", () => {
    const invalidReqBody = {
      first_name: 123,
      last_name: "test LN",
      address: "Street 1 ed",
      city: "City ed",
      state: "State ed",
      country: "Country ed",
      postcode: "1234AA ed",
      phone: "709876543213",
      dob: "1973-03-03",
      email: "update@test.test",
      password: "updatePW12345",
    };

    registerApi.setUp().then((userInfo) => {
      cy.get(`@${tokenAliasName}`).then((token: any) => {
        // update user
        userApi
          .updateUser(userInfo.userId, token, invalidReqBody)
          .then((updateUserResp) => {
            expect(updateUserResp.status).to.eq(422);
            expect(updateUserResp.body.first_name[0]).to.match(
              /first name(.*)must be(.*)string/
            );
          });
      });
    });
  });

  it("Update user should fail, if incomplete data is provided", () => {
    const incompleteReqBody = {
      first_name: "test FN",
      address: "Street 1 ed",
      city: "City ed",
      state: "State ed",
      country: "Country ed",
      postcode: "1234AA ed",
      phone: "709876543213",
      dob: "1973-03-03",
      email: "update@test.test",
      password: "updatePW12345",
    };

    registerApi.setUp().then((userInfo) => {
      cy.get(`@${tokenAliasName}`).then((token: any) => {
        // update user
        userApi
          .updateUser(userInfo.userId, token, incompleteReqBody)
          .then((updateUserResp) => {
            expect(updateUserResp.status).to.eq(422);
            expect(updateUserResp.body.last_name[0]).to.match(
              /last name(.*)is required/
            );
          });
      });
    });
  });

  it("Should delete user, if valid user id is provided", () => {
    registerApi.setUp().then((userInfo) => {
      cy.get(`@${tokenAliasName}`).then((token: any) => {
        // delete user
        userApi.deleteUser(userInfo.userId, token).then((deleteUserResp) => {
          expect(deleteUserResp.status).to.eq(204);
        });

        // verify, user is deleted
        userApi.getUser(userInfo.userId, token).then((getUserResp) => {
          expect(getUserResp.status).to.eq(404);
          expect(getUserResp.body.message.toLowerCase()).to.include(
            "not found"
          );
        });
      });
    });
  });

  it("Should return forbidden, if unauthorized user is trying to delete a user", () => {
    // register new user
    registerApi.setUp().then((newUserInfo) => {
      // login as customer
      loginApi
        .login(users.customer2.EMAIL, users.customer2.PASSWORD)
        .then((loginResp) => {
          const customerToken = loginResp.body.access_token;
          // try to delete the new user using the customer
          userApi
            .deleteUser(newUserInfo.userId, customerToken)
            .then((deleteUserResp) => {
              expect(deleteUserResp.status).to.eq(403);
              expect(deleteUserResp.body.message.toLowerCase()).to.contain(
                "forbidden"
              );
            });
        });
    });
  });
});
