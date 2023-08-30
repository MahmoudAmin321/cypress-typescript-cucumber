import dashboardPage from "../admin/dashboard.pom";
import editProductsPage from "../admin/editProduct.pom";
import productsPage from "../admin/products.pom";
import accountPage from "../customer/account.pom";
import homePage from "../home.pom";
import loginPage from "../login.pom";

class PagesFactory {
  /**
   * Creates a map between business page name (BDD name) and page object
   * @param bddPageName
   * @returns The page object of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  getPage(bddPageName: string) {
    if (bddPageName.toLowerCase().match(/log(( *)|(-*))in/)) {
      return loginPage;
    } else if (bddPageName.toLowerCase().match(/board/)) {
      return dashboardPage;
    } else if (bddPageName.toLowerCase().match(/a(c+)ount/)) {
      return accountPage;
    } else if (bddPageName.toLowerCase().match(/home/)) {
      return homePage;
    } 
    else if (bddPageName.toLowerCase().match(/products/)) {
      return productsPage;
    }
    else if (bddPageName.toLowerCase().match(/edit product/)) {
      return editProductsPage;
    }
    else {
      throw Error(`Page [ ${bddPageName} ] doesn't exist in the map`);
    }
  }

  getLoginRedirectPage(user: string) {
    if (user.toLowerCase().match(/admin/)) {
      return dashboardPage;
    } else if (user.toLowerCase().match(/customer\d/)) {
      return accountPage;
    } else {
      throw Error(`User [ ${user} ] doesn't exist in the map`);
    }
  }
}

const pagesFactory = new PagesFactory();
export default pagesFactory;
