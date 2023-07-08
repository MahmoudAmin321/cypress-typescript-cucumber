import { ProductCard } from "../../../pages/_common/components/productCard";
import homePage from "../../../pages/home.pom";
import { SortBase } from "./sortBase";
import sortFactory, { SortOrder } from "./_sortFactory";

class SortByName extends SortBase {
  assertSort(sortOrder: SortOrder) {
    let previousTxt: string = null;
    homePage.productCards().each(($card: ProductCard) => {
      $card
        .name()
        .invoke("text")
        .then((currentTxt) => {
          if (previousTxt) {
            const firstCharCurrentTxt = currentTxt.trim().charCodeAt(0);
            const firstCharPreviousTxt = previousTxt.trim().charCodeAt(0);
            switch (sortOrder) {
              case sortFactory.ascending:
                expect(firstCharCurrentTxt).to.gte(firstCharPreviousTxt);
                break;
              case sortFactory.descending:
                expect(firstCharCurrentTxt).to.lte(firstCharPreviousTxt);
                break;
            }
          }

          previousTxt = currentTxt;
        });
    });
  }
}

const sortByName = new SortByName();
export default sortByName;
