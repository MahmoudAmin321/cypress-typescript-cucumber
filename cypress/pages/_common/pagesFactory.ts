import dashboardPage from "../admin/dashboard.pom";
import editProductPage from "../admin/editProduct.pom";
import productsPage from "../admin/products.pom";
import accountPage from "../customer/account.pom";
import homePage from "../home.pom";
import loginPage from "../login.pom";
import productDetailsPage from "../productDetails.pom";

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
      return editProductPage;
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

  getProductPage(bddSide: string) {
    if (bddSide.toLowerCase().match(/admin/)) {
      return editProductPage;
    } else {
      return productDetailsPage;
    }
  }
}

const pagesFactory = new PagesFactory();
export default pagesFactory;
