import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import homePage from "../../pages/home.pom";
import productCardInfo from "../../pages/_common/product/productCardInfo";
import { apis } from "../../support/consts";
import productDetailsPage from "../../pages/productDetails.pom";
import { Factory } from "../../pages/_common/factory";

When(
  "{word} store details of {int}. card",
  function (_: string, cardNr: number) {
    homePage.productCards().then(($cards) => {
      const card = $cards[cardNr - 1];
      card
        .image()
        .invoke("attr", "src")
        .then((src: string) => {
          productCardInfo.image.src = src.trim();
        });

      card
        .name()
        .invoke("text")
        .then((text: string) => {
          productCardInfo.name.text = text.trim();
        });

      card
        .price()
        .invoke("text")
        .then((price: string) => {
          productCardInfo.price.text = price.trim();
        });
    });
  }
);

When("{word} have {int}. card opened", function (_: string, cardNr: number) {
  homePage.productCards().then(($cards) => {
    const card = $cards[cardNr - 1];
    cy.spyApi(apis.specificProduct);
    card.name().click();
    productDetailsPage.waitForPage();
  });
});

Then("Product details should be same as in card", function () {
  productDetailsPage.details
    .image()
    .invoke("attr", "src")
    .should("eq", productCardInfo.image.src);

  productDetailsPage.details
    .name()
    .invoke("text")
    .should("eq", productCardInfo.name.text);

  productDetailsPage.details
    .unitPrice()
    .invoke("text")
    .then((text) => {
      expect(`$${text}`).to.eq(productCardInfo.price.text);
    });
});

When("You increase quantity", function () {
  productDetailsPage.details.increaseQuantity().click();
});

When("You decrease quantity", function () {
  productDetailsPage.details.decreaseQuantity().click();
});

When("You set quantity to {string}", function (quantity: string) {
  productDetailsPage.details.quantity().clear().type(quantity);
});

When("You add product to cart", function () {
  productDetailsPage.details.addToCartBtn().click();
});

Then(
  "{string} quantity is {string}",
  function (bddType: string, bddQuantity: string) {
    Factory.getQuantityText(bddType).should("equal", bddQuantity);
  }
);

Then("Success toaster {string}", function (bddAssertion: string) {
  const assertion = Factory.getAssertion(bddAssertion);
  productDetailsPage.successToaster().should(assertion);
});
