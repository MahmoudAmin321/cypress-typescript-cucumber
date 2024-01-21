import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import homePage from "../../pages/home.pom";
import { ProductCard } from "../../pages/_common/components/cards/productCard";
import products from "../../support/models/_common/products";
import { apis } from "../../support/consts";
import { Factory } from "../../pages/_common/factory";
import brandsApi from "../../testApi/_common/apiPom/brand/brandsApi";

Given("{word} store products prices order", function (_: string) {
  // cleanup array (remove all previously stored items)
  products.pricesOriginalOrder = [];

  homePage.productCards().each(($card: ProductCard) => {
    $card
      .price()
      .invoke("text")
      .then((price) => {
        products.pricesOriginalOrder.push(price);
      });
  });
});

Given("{word} store products names", function (_: string) {
  // cleanup array (remove all previously stored items)
  products.names = [];

  homePage.productCards().each(($card: ProductCard) => {
    $card
      .name()
      .invoke("text")
      .then((name) => {
        products.names.push(name);
      });
  });
});

Then(
  "Product with price {float} {string}",
  function (bddPrice: number, bddAssertion: string) {
    const prices = products.pricesOriginalOrder.map((priceText) =>
      Number(priceText.trim().replace("$", ""))
    );

    const assertion = Factory.getAssertion(bddAssertion);
    cy.wrap(prices).should(assertion, bddPrice);
  }
);

Then(
  "Product with name {string} {string}",
  function (bddName: string, bddAssertion: string) {
    const names = products.names.map((name) => name.trim().toLowerCase());
    const assertion = Factory.getAssertion(bddAssertion);
    cy.wrap(names).should(assertion, bddName.toLowerCase());
  }
);

Then(
  "{int}. product {string} {string}",
  function (bddOrder: number, bddAssertion: string, bddName: string) {
    const nthProductName = products.names[bddOrder - 1].trim().toLowerCase();

    const assertion = Factory.getAssertion(bddAssertion);
    cy.wrap(nthProductName).should(assertion, bddName.toLowerCase());
  }
);

When(
  "{word} have slider {string} button clicked",
  function (_: string, bddBtnPosition: string) {
    cy.spyApi(apis.products);
    homePage.getButton(bddBtnPosition).click();
    cy.wait(`@${apis.products.interceptorName}`);
  }
);

Then(
  "Slider {string} value is {int}",
  function (bddValuePosition: string, bddValue: number) {
    homePage
      .getValueElement(bddValuePosition)
      .invoke("text")
      .then((text: string) => {
        const actualValue = Number(text.trim());
        expect(actualValue).to.equal(bddValue);
      });
  }
);

When("Displayed products are less than maximum", function () {
  homePage
    .productCards()
    .should("have.length.lessThan", homePage.maxProductsPerPage);
});

Given("You programmatically setup brands", function () {
  brandsApi.setUp();
});
