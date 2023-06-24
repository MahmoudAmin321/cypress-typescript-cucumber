import { When } from "@badeball/cypress-cucumber-preprocessor";
import loginPage from "../../pages/login.pom";
import { User } from "../../support/models/userInfo";

When("{word} enter credentials of {user}", function (_: string, user: User) {
  loginPage.typeCredentials(user.user);
});
