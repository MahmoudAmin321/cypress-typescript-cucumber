import loginPage from "../../pages/login.pom";

describe("Login", () => {
  before(() => {
    cy.log("before all tests in this suite");
  });

  beforeEach(() => {
    cy.log("before each test in this suite");
  });

  afterEach(() => {
    cy.log("after each test in this suite");
  });

  after(() => {
    cy.log("after all tests in this suite");
  });

  it("Upon entering empty email, correct msg should be displayed", () => {
    cy.visit(loginPage.relativeUrl());

    // with click
    loginPage.form.loginBtn().click();
    loginPage.validations
      .email()
      .invoke("text")
      .should("match", /E(-*)mail is required(\.*)( *)/);

    // without click
    loginPage.form.email().type("dummy").clear();
    loginPage.validations
      .email()
      .invoke("text")
      .should("match", /E(-*)mail is required(\.*)( *)/);
  });

  it("Upon entering invalid email, correct msg should be displayed", () => {
    cy.visit(loginPage.relativeUrl());

    // with click
    loginPage.form.email().clear().type("invalid@");
    loginPage.form.loginBtn().click();
    loginPage.validations
      .email()
      .invoke("text")
      .should("match", /E(-*)mail format is invalid(\.*)( *)/);

    // without click
    loginPage.form.email().clear().type("invalid@");
    loginPage.validations
      .email()
      .invoke("text")
      .should("match", /E(-*)mail format is invalid(\.*)( *)/);
  });
});
