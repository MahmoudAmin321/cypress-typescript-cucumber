import { UserInfo } from "../support/models/userInfo";
import { Base } from "./common/base.pom";

class Login extends Base {
  readonly relativeUrl = "/auth/login";
  readonly form = {
    // Declare DOM elements as functions to get them fresh (with latest state) from DOM each time you access the property
    email: () => cy.get("[data-test=email]"),
    password: () => cy.get("[data-test=password]"),
    loginBtn: () => cy.get("[data-test=login-submit]"),
  };

  readonly validations = {
    email: () => cy.get("[data-test=email-error]"),
    password: () => cy.get("password-error"),
    login: () => cy.get("[data-test=login-error]"),
  };

  readonly registerLink = () => cy.get("[data-test=register-link]");
  readonly forgotPWLink = () => cy.get("[data-test=forgot-password-link]");

  waitForPage() {
    return this.form.email().should("be.visible");
  }

  getButton(businessBtnName: string): Cypress.Chainable<any> {
    if (businessBtnName.toLowerCase().match(/log(( *)|(-*))in/)) {
      return this.form.loginBtn();
    } else if (businessBtnName.toLowerCase().match(/regist(.*)/)) {
      return this.registerLink();
    } else if (businessBtnName.toLowerCase().match(/forg(.*)/)) {
      return this.forgotPWLink();
    } else {
      throw Error(`Button [ ${businessBtnName} ] doesn't exist in the map`);
    }
  }

  typeCredentials(user: UserInfo) {
    const emailField = this.form.email();
    const pwField = this.form.password();
    this.typeInField(user.EMAIL, emailField);
    this.typeInField(user.PASSWORD, pwField);
  }
}

const loginPage = new Login();
export default loginPage;
