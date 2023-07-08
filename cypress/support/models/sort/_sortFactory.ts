import sortByName from "./sortByName";
import sortByNone from "./sortByNone";
import sortByPrice from "./sortByPrice";

export type SortOrder = "asc" | "desc" | "arbitary";

class SortFactory {
  readonly ascending: SortOrder = "asc";
  readonly descending: SortOrder = "desc";
  readonly arbitary: SortOrder = "arbitary";

  getSortOrder(bddSortOrder: string): SortOrder {
    if (bddSortOrder.toLowerCase().match(/arbitary|default|original|none/)) {
      return this.arbitary;
    } else if (bddSortOrder.toLowerCase().match(/asc/)) {
      return this.ascending;
    } else if (bddSortOrder.toLowerCase().match(/desc/)) {
      return this.descending;
    } else {
      throw Error(`[ ${bddSortOrder} ] Not found in sort order map`);
    }
  }

  getDesiredSort(bddSort: string) {
    if (bddSort.toLowerCase().match(sortByNone.regex)) {
      return sortByNone;
    } else if (bddSort.toLowerCase().match(/name/)) {
      return sortByName;
    } else if (bddSort.toLowerCase().match(/price/)) {
      return sortByPrice;
    } else {
      throw Error(`[ ${bddSort} ] Not found in sort map`);
    }
  }
}

const sortFactory = new SortFactory();
export default sortFactory;
