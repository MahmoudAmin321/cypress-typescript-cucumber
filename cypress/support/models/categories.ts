class CategoriesFactory {
  /**
   * Creates a map between business category name (BDD name) and its index
   * @param bddCategoryName
   * @returns The index of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  getCategoryIndex(bddCategoryName: string) {
    const lower = bddCategoryName.toLowerCase();
    if (lower.toLowerCase().match(/hammer/)) {
      return 0;
    } else if (lower.toLowerCase().match(/hand( *)(-*)saw/)) {
      return 1;
    } else if (lower.toLowerCase().match(/wrench/)) {
      return 2;
    } else if (lower.toLowerCase().match(/screw( *)(-*)driver/)) {
      return 3;
    } else if (lower.toLowerCase().match(/plier/)) {
      return 4;
    } else if (lower.toLowerCase().match(/drill/)) {
      return 5;
    } else {
      throw Error(`Category [ ${bddCategoryName} ] doesn't exist in the map`);
    }
  }
}

const categoriesFactory = new CategoriesFactory();
export default categoriesFactory;
