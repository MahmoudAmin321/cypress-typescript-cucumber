import { Given } from "@badeball/cypress-cucumber-preprocessor";
import homePage from "../../pages/home.pom";
import sortByNone from "../../support/models/sort/sortByNone";
import { ProductCard } from "../../pages/_common/components/productCard";

Given("{word} store products prices order", function (_: string) {
  homePage.productCards().each(($card: ProductCard) => {
    $card
      .price()
      .invoke("text")
      .then((price) => {
        sortByNone.originalProductsPricesOrder.push(price);
      });
  });
});
