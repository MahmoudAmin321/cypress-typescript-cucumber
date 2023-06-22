import dashboardPage from "../admin/dashboard.pom";
import accountPage from "../customer/account.pom";
import loginPage from "../login.pom";

export class PagesFactory {
  /**
   * Creates a map between business page name (BDD name) and page object
   * @param businessPageName
   * @returns The page object of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  getPage(businessPageName: string) {
    if (businessPageName.toLowerCase().match(/log(( *)|(-*))in/)) {
      return loginPage;
    } else if (businessPageName.toLowerCase().match(/board/)) {
      return dashboardPage;
    } else if (businessPageName.toLowerCase().match(/a(c+)ount/)) {
      return accountPage;
    } else {
      throw Error(`Page [ ${businessPageName} ] doesn't exist in the map`);
    }
  }
}

const pagesFactory = new PagesFactory();
export default pagesFactory;
