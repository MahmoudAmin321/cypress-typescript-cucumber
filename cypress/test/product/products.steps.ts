import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
import homePage from "../../pages/home.pom";
import { ProductCard } from "../../pages/_common/components/productCard";
import productsPrices from "../../support/models/_common/productsPrices";
import { apis } from "../../support/consts";

Given("{word} store products prices order", function (_: string) {
  // cleanup prices array (remove all previously stored items)
  productsPrices.originalOrder = [];

  homePage.productCards().each(($card: ProductCard) => {
    $card
      .price()
      .invoke("text")
      .then((price) => {
        productsPrices.originalOrder.push(price);
      });
  });
});

Then(
  "Product with price {float} {string}",
  function (bddPrice: number, expected: string) {
    const prices = productsPrices.originalOrder.map((priceText) =>
      Number(priceText.trim().replace("$", ""))
    );

    switch (expected.toLowerCase()) {
      case "exist":
        expect(prices).to.include(bddPrice);
        break;
      case "not exist":
        expect(prices).to.not.include(bddPrice);
        break;
      default:
        throw Error(
          `Invalid expected result [${expected}]. Should be either [exist] or [not exist] `
        );
    }
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
