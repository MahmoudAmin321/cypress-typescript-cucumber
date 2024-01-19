class CategoriesFactory {
  /**
   * Creates a map between business category name (BDD name) and its index
   * @param bddCategoryName
   * @returns The index of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  getCategoryIndex(bddCategoryName: string) {
    const lower = bddCategoryName.trim().toLowerCase();
    if (lower.trim().match(/hammer/)) {
      return 1;
    } else if (lower.match(/hand( *)(-*)saw/)) {
      return 2;
    } else if (lower.match(/wrench/)) {
      return 3;
    } else if (lower.match(/screw( *)(-*)driver/)) {
      return 4;
    } else if (lower.match(/plier/)) {
      return 5;
    } else if (lower.match(/chisels/)) {
      return 6;
    } 
    else if (lower.match(/chisels/)) {
      return 7;
    } else {
      throw Error(`Category [ ${bddCategoryName} ] doesn't exist in the map`);
    }
  }
}

const categoriesFactory = new CategoriesFactory();
export default categoriesFactory;
