import sortByNone from "./sortByNone";

export class SortOptions {
  readonly sortOptionsValues = {
    none: "",
    nameAsc: "name,asc",
    nameDesc: "name,desc",
    priceAsc: "price,asc",
    priceDesc: "price,desc",
  };

  sortOptionValue: string;

  constructor(bddSortOption: string) {
    this.sortOptionValue = this.getSortOption(bddSortOption);

    for (let key in this.sortOptionsValues) {
      let value: string = this.sortOptionsValues[key];
      if (value === this.sortOptionValue) {
        //Exit the function (hence No error is thrown)
        return;
      }
    }
    throw Error(`[ ${bddSortOption} ] Not found in sort options map`);
  }

  private getSortOption(bddSortOption: string): string | undefined {
    if (bddSortOption.toLowerCase().match(sortByNone.regex)) {
      return this.sortOptionsValues.none;
    } else if (bddSortOption.toLowerCase().match(/name(.*)asc|a( *)-( *)z/)) {
      return this.sortOptionsValues.nameAsc;
    } else if (bddSortOption.toLowerCase().match(/name(.*)desc|z( *)-( *)a/)) {
      return this.sortOptionsValues.nameDesc;
    } else if (
      bddSortOption.toLowerCase().match(/price(.*)asc|low( *)-( *)high/)
    ) {
      return this.sortOptionsValues.priceAsc;
    } else if (
      bddSortOption.toLowerCase().match(/price(.*)desc|high( *)-( *)low/)
    ) {
      return this.sortOptionsValues.priceDesc;
    } else {
      return undefined;
    }
  }
}
