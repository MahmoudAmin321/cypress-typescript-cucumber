import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import homePage from "../../pages/home.pom";
import productCardInfo from "../../pages/_common/product/productCardInfo";
import { apis } from "../../support/consts";
import productDetails from "../../pages/productDetails.pom";

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

When("{word} open {int}. card", function (_: string, cardNr: number) {
  homePage.productCards().then(($cards) => {
    const card = $cards[cardNr - 1];
    cy.spyApi(apis.specificProduct);
    card.name().click();
    productDetails.waitForPage();
  });
});

Then("Product details should be same as in card", function () {
  productDetails.details
    .image()
    .invoke("attr", "src")
    .should("eq", productCardInfo.image.src);

  productDetails.details
    .name()
    .invoke("text")
    .should("eq", productCardInfo.name.text);

  productDetails.details
    .unitPrice()
    .invoke("text")
    .then((text) => {
      expect(`$${text}`).to.eq(productCardInfo.price.text);
    });
});
