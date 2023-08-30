import { Given } from "@badeball/cypress-cucumber-preprocessor";
import { User } from "../../../support/models/userInfo";

Given(
  "{word} programmatically login as {user}",
  function (_: string, user: User) {
    cy.loginProgrammatically(user.user);
  }
);

Given("{word} login as {user}", function (_: string, user: User) {
  cy.loginWithUI(user.user);
});
