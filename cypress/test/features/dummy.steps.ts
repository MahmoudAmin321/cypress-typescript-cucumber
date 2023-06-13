import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
import { users } from "../../support/consts";
import { User } from "../../support/models/userInfo";

Given("Dummy step", function () {
  cy.log("this is dummy a dummy step");
  cy.log("admin email ", users.admin.EMAIL);
  cy.log("user2 email ", users.user2.EMAIL);
});

When("{word} make dummy step as {user}", function (_: string, user: User) {
  cy.log("User prop is ", user.user);
});
