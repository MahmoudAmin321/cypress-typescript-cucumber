import { ProductCard } from "../../../pages/_common/components/cards/productCard";
import homePage from "../../../pages/home.pom";
import { SortBase } from "./sortBase";
import { SortOrder } from "./_sortFactory";
import products from "../_common/products";

class SortByNone extends SortBase {
  readonly regex = /^$|empty|none/;

  assertSort(sortOrder: SortOrder) {
    // Just cautious assertion, that both lengths are the same
    const originalProductsAmount: number = products.pricesOriginalOrder.length;
    homePage.productCards().should("have.length", originalProductsAmount);

    homePage.productCards().each(($card: ProductCard, index) => {
      $card
        .price()
        .invoke("text")
        .should("deep.equal", products.pricesOriginalOrder[index]);
    });
  }
}

const sortByNone = new SortByNone();
export default sortByNone;
