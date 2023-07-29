import { ProductCard } from "../../../pages/_common/components/productCard";
import homePage from "../../../pages/home.pom";
import { SortBase } from "./sortBase";
import { SortOrder } from "./_sortFactory";
import productsPrices from "../_common/productsPrices";

class SortByNone extends SortBase {
  readonly regex = /^$|empty|none/;

  assertSort(sortOrder: SortOrder) {
    // Just cautious assertion, that both lengths are the same
    const originalProductsAmount: number = productsPrices.originalOrder.length;
    homePage.productCards().should("have.length", originalProductsAmount);

    homePage.productCards().each(($card: ProductCard, index) => {
      $card
        .price()
        .invoke("text")
        .should("deep.equal", productsPrices.originalOrder[index]);
    });
  }
}

const sortByNone = new SortByNone();
export default sortByNone;
