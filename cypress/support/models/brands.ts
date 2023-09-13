class BrandsFactory {
  /**
   * Creates a map between business brand name (BDD name) and its index
   * @param bddBrandName
   * @returns The index of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  getBrandIndex(bddBrandName: string) {
    const lower = bddBrandName.toLowerCase();
    if (lower.toLowerCase().match(/ 1$/)) {
      return 0;
    } else if (lower.toLowerCase().match(/ 2$/)) {
      return 1;
    } else if (lower.toLowerCase().match(/ 3$/)) {
      return 2;
    } else if (lower.toLowerCase().match(/ 4$/)) {
      return 3;
    } else if (lower.toLowerCase().match(/ 5$/)) {
      return 4;
    } else if (lower.toLowerCase().match(/ 6$/)) {
      return 5;
    } else {
      throw Error(`Brand [ ${bddBrandName} ] doesn't exist in the map`);
    }
  }
}

const brandsFactory = new BrandsFactory();
export default brandsFactory;
