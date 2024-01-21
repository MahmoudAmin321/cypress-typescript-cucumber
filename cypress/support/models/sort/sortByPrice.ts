import { ProductCard } from "../../../pages/_common/components/cards/productCard";
import homePage from "../../../pages/home.pom";
import { SortBase } from "./sortBase";
import sortFactory, { SortOrder } from "./_sortFactory";

class SortByPrice extends SortBase {
  assertSort(sortOrder: SortOrder) {
    let previousTxt: string = null;
    homePage.productCards().each(($card: ProductCard) => {
      $card
        .price()
        .invoke("text")
        .then((currentTxt) => {
          if (previousTxt) {
            const currentPrice = Number(currentTxt.trim().replace("$", ""));
            const previousPrice = Number(previousTxt.trim().replace("$", ""));
            switch (sortOrder) {
              case sortFactory.ascending:
                expect(currentPrice).to.gte(previousPrice);
                break;
              case sortFactory.descending:
                expect(currentPrice).to.lte(previousPrice);
                break;
            }
          }
          previousTxt = currentTxt;
        });
    });
  }
}

const sortByPrice = new SortByPrice();
export default sortByPrice;
