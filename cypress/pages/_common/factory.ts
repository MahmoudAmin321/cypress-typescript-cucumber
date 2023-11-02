import productDetailsPage from "../productDetails.pom";
import { Base } from "./base.pom";

export class Factory {
  /**
   * Creates a map between business common button name (BDD name) and chainable common button
   * @param bddBtnName
   * @returns The chainable common button of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  static getButton(bddBtnName: string) {
    if (bddBtnName.toLowerCase().match(/user( *)(menu)*/)) {
      return Base.userNavMenu.menu();
    } else if (bddBtnName.toLowerCase().match(/(my)*( *)account/)) {
      return Base.userNavMenu.myAccount();
    } else if (bddBtnName.toLowerCase().match(/dash(.*)/)) {
      return Base.userNavMenu.dashboard();
    } else if (bddBtnName.toLowerCase().match(/products/)) {
      return Base.userNavMenu.products();
    } else {
      throw Error(`Common button [ ${bddBtnName} ] doesn't exist in the map`);
    }
  }

  static getAssertion(bddAssertion: string): string {
    let result = "";
    const not = "not.";
    const lower = bddAssertion.toLowerCase();

    if (lower.match(/n(o|')t /)) {
      result = not;
    }

    if (lower.match(/^is$/)) {
      result += "equal";
      return result;
    } else if (lower.match(/exist/)) {
      result += "exist";
      return result;
    } else if (lower.match(/contain/)) {
      result += "contain";
      return result;
    } else if (lower.match(/visible/)) {
      result += "be.visible";
      return result;
    } else if (lower.match(/include/)) {
      result += "include";
      return result;
    } else {
      throw Error(`Invalid expected result [${bddAssertion}].`);
    }
  }

  static getQuantityText(bddType: string) {
    if (bddType.toLowerCase().match(/product/)) {
      return productDetailsPage.details.quantity().invoke("val")
    }
    else if (bddType.toLowerCase().match(/cart/)) {
      return Base.cartQuantity().invoke("text")
    } else {
      throw Error(`Type [ ${bddType} ] doesn't exist in the map`);
    }
  }
}
