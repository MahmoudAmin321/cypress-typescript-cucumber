export class CartColumn {
  name: string;

  constructor(bddCartColumnName: string) {
    this.name = this.getCartColumnName(bddCartColumnName);
    if (!this.name) {
      throw Error(`[ ${bddCartColumnName} ] Not found in the map`);
    }
  }

  getCartColumnName(bddCartColumnName: string): string | undefined {
    if (bddCartColumnName.toLowerCase().match(/item/)) {
      return "Item";
    } else if (bddCartColumnName.toLowerCase().match(/quantity/)) {
      return "Quantity";
    } else if (bddCartColumnName.toLowerCase().match(/unit price/)) {
      return "Price";
    } else if (bddCartColumnName.toLowerCase().match(/total price/)) {
      return "Total";
    } else {
      return undefined;
    }
  }
}
