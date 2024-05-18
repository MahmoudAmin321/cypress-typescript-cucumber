import { When } from "@badeball/cypress-cucumber-preprocessor";
import myProfilePage from "../../../pages/customer/myProfile.pom";
import { apis } from "../../../support/consts";

When("You have updated user profile", function () {
  // spy
  cy.spyApi(apis.specificUser, "PUT");

  // action, that triggers the api call
  myProfilePage.profileSection.updateProfileBtn().click();

  // wait
  cy.wait(`@${apis.specificUser.interceptorName}`);
});
