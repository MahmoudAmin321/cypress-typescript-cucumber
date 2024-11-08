import categoriesPage from "./categories.pom";
import productsPage from "./products.pom";

class EntitiesFactory {
  getEntity(bddEntityName: string) {
    const lower = bddEntityName.toLowerCase();
    if (lower.match(/product/)) {
      return productsPage;
    } else if (lower.match(/categor/)) {
      return categoriesPage;
    } else {
      throw Error(`Entity [ ${bddEntityName} ] doesn't exist in the map`);
    }
  }

  getColumnSetter(bddColumnName: string, bddEntityName: string) {
    const storedRowInfo = this.getEntity(bddEntityName).storedRowInfo;
    const lower = bddColumnName.toLowerCase();

    if (lower.match(/id$/)) {
      return (id: string) => (storedRowInfo["id"] = id);
    } else if (lower.match(/name/)) {
      return (name: string) => (storedRowInfo["name"] = name);
    } else if (lower.match(/stock/)) {
      return (stock: string) => (storedRowInfo["stock"] = stock);
    } else if (lower.match(/price/)) {
      return (price: string) => (storedRowInfo["price"] = price);
    } else if (lower.match(/slug/)) {
      return (slug: string) => (storedRowInfo["slug"] = slug);
    } else {
      throw Error(`Column [ ${bddColumnName} ] doesn't exist in the map`);
    }
  }

  getStoredColumn(bddColumnName: string, bddEntityName: string) {
    const storedRowInfo = this.getEntity(bddEntityName).storedRowInfo;
    const lower = bddColumnName.toLowerCase();

    if (lower.match(/id$/)) {
      return storedRowInfo["id"];
    } else if (lower.match(/name/)) {
      return storedRowInfo["name"];
    } else if (lower.match(/stock/)) {
      return storedRowInfo["stock"];
    } else if (lower.match(/price/)) {
      return storedRowInfo["price"];
    } else if (lower.match(/slug/)) {
      return storedRowInfo["slug"];
    } else {
      throw Error(`Column [ ${bddColumnName} ] doesn't exist in the map`);
    }
  }

  getColumnFromDOM(
    bddColumnName: string,
    bddEntityName: string,
    rowNr: number
  ) {
    const table: any = this.getEntity(bddEntityName).table;
    const lower = bddColumnName.toLowerCase();

    if (lower.match(/id$/)) {
      return table.nthId(rowNr);
    } else if (lower.match(/name/)) {
      return table.nthName(rowNr);
    } else if (lower.match(/stock/)) {
      return table.nthStock(rowNr);
    } else if (lower.match(/price/)) {
      return table.nthPrice(rowNr);
    } else if (lower.match(/slug/)) {
      return table.nthSlug(rowNr);
    } else {
      throw Error(`Column [ ${bddColumnName} ] doesn't exist in the map`);
    }
  }
}

const entitiesFactory = new EntitiesFactory();
export default entitiesFactory;
