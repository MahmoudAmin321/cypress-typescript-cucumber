import { ProductCard } from "../../../pages/_common/components/productCard";
import homePage from "../../../pages/home.pom";
import { SortBase } from "./sortBase";
import { SortOrder } from "./_sortFactory";

class SortByNone extends SortBase {
  readonly regex = /^$|empty|none/;

  originalProductsPricesOrder: string[] = [];

  assertSort(sortOrder: SortOrder) {
    // Just cautious assertion, that both lenghts are the same
    const originalProductsAmount: number =
      this.originalProductsPricesOrder.length;
    homePage.productCards().should("have.length", originalProductsAmount);

    homePage.productCards().each(($card: ProductCard, index) => {
      $card
        .price()
        .invoke("text")
        .should("deep.equal", this.originalProductsPricesOrder[index]);
    });
  }
}

const sortByNone = new SortByNone();
export default sortByNone;
