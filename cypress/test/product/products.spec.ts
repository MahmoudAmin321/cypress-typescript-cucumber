import { getProducts } from "../../apiMocks/product/getProducts";
import homePage from "../../pages/home.pom";
import { apis, users } from "../../support/consts";
import { Helper } from "../../support/helper";

describe("Product", () => {
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

  it("A product card should have image, name and price", () => {
    cy.loginProgrammatically(users.customer2);

    cy.stubApi({ api: apis.products, resBody: getProducts });
    cy.visit(homePage.relativeUrl());
    cy.wait(`@${apis.products.interceptorName}`);

    homePage.productCards().then((cards) => {
      const randomIndex = Helper.getRandomInteger(0, cards.length - 1);
      cards[randomIndex].image().should("be.visible");
      cards[randomIndex]
        .name()
        .should("be.visible")
        .invoke("text")
        .should("match", /.+/);
      cards[randomIndex]
        .price()
        .should("be.visible")
        .invoke("text")
        .should("match", homePage.priceRegex);
    });
  });
});
