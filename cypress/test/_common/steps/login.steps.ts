import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
import { User } from "../../../support/models/userInfo";
import { apis } from "../../../support/consts";
import loginPage from "../../../pages/login.pom";

Given(
  "{word} programmatically login as {user}",
  function (_: string, user: User) {
    cy.loginProgrammatically(user.user);
  }
);

Given("{word} login as {user}", function (_: string, user: User) {
  cy.loginWithUI(user.user);
});

When("You login in cart as {user}", function (user: User) {
  cy.spyApi(apis.currentUser);

  loginPage.typeCredentials(user.user);
  loginPage.form.loginBtn().click();

  cy.wait(`@${apis.currentUser.interceptorName}`);
});
