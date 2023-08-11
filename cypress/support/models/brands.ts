class BrandsFactory {
  /**
   * Creates a map between business brand name (BDD name) and its index
   * @param bddBrandName
   * @returns The index of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  getBrandIndex(bddBrandName: string) {
    const lower = bddBrandName.toLowerCase();
    if (lower.toLowerCase().match(/1/)) {
      return 0;
    } else if (lower.toLowerCase().match(/2/)) {
      return 1;
    } else if (lower.toLowerCase().match(/new brand catgjo/)) {
      return 2;
    } else if (lower.toLowerCase().match(/nbnqif/)) {
      return 3;
    } else if (lower.toLowerCase().match(/zfxdxz/)) {
      return 4;
    } else if (lower.toLowerCase().match(/qmxwqho/)) {
      return 5;
    } else if (lower.toLowerCase().match(/vtassgd/)) {
      return 6;
    } else {
      throw Error(`Brand [ ${bddBrandName} ] doesn't exist in the map`);
    }
  }
}

const brandsFactory = new BrandsFactory();
export default brandsFactory;
