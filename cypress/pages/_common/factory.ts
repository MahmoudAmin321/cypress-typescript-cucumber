import productDetailsPage from "../productDetails.pom";
import { Base } from "./base.pom";

export class Factory {
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
      return productDetailsPage.details.quantity().invoke("val");
    } else if (bddType.toLowerCase().match(/cart/)) {
      return Base.cartQuantity().invoke("text");
    } else {
      throw Error(`Type [ ${bddType} ] doesn't exist in the map`);
    }
  }
}
