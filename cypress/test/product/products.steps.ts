import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import homePage from "../../pages/home.pom";
import { ProductCard } from "../../pages/_common/components/productCard";
import products from "../../support/models/_common/productsPrices";
import { apis } from "../../support/consts";
import { Helper } from "../../support/helper";

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

    const assertion = Helper.getAssertion(bddAssertion);
    cy.wrap(prices).should(`${assertion}include`, bddPrice);
  }
);

Then(
  "Product with name {string} {string}",
  function (bddName: string, bddAssertion: string) {
    const names = products.names.map((name) => name.trim().toLowerCase());
    const assertion = Helper.getAssertion(bddAssertion);
    cy.wrap(names).should(`${assertion}include`, bddName.toLowerCase());
  }
);

Then(
  "{int}. product is {string}",
  function (bddOrder: number, bddName: string) {
    const firstProductName = products.names[bddOrder - 1].trim().toLowerCase();

    cy.wrap(firstProductName).should("equal", bddName.toLowerCase());
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
