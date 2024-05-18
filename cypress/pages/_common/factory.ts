import cartPage from "../cart.pom";
import myFavoritesPage from "../customer/myFavorites.pom";
import myProfilePage from "../customer/myProfile.pom";
import productDetailsPage from "../productDetails.pom";
import { Base } from "./base.pom";
import { Favorite } from "./components/cards/favorite";

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
    } else if (lower.match(/visible|displayed/)) {
      result += "be.visible";
      return result;
    } else if (lower.match(/include/)) {
      result += "include";
      return result;
    }else if (lower.match(/disabled/)) {
      result += "be.disabled";
      return result;
    } else if (lower.match(/enabled/)) {
      result += "be.enabled";
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

  static getChainableItems(bddPageName: string): Cypress.Chainable<any> {
    const lower = bddPageName.trim().toLowerCase();
    if (lower.match(/cart/)) {
      return cartPage.cartStep.itemsTable.items();
    } else if (lower.match(/favo/)) {
      return myFavoritesPage.favorites();
    } else {
      throw Error(`Page [ ${bddPageName} ] doesn't exist in the map`);
    }
  }

  static getFavoriteDetail(
    favorite: Favorite,
    bddDetailName: string
  ): Cypress.Chainable<any> {
    const lower = bddDetailName.trim().toLowerCase();
    if (lower.match(/image/)) {
      return favorite.image();
    } else if (lower.match(/name/)) {
      return favorite.name();
    } else if (lower.match(/description/)) {
      return favorite.description();
    } else if (lower.match(/delete/)) {
      return favorite.deleteBtn();
    } else {
      throw Error(
        `Favorite detail [ ${bddDetailName} ] doesn't exist in the map`
      );
    }
  }

  static getAddressField(
    bddFieldName: string
  ): Cypress.Chainable<any> {
    const lower = bddFieldName.trim().toLowerCase();
    if (lower.match(/address/)) {
      return Base.addressFields.address();
    }else if (lower.match(/post(.*)code/)) {
      return Base.addressFields.postcode();
    }else if (lower.match(/city/)) {
      return Base.addressFields.city();
    }else if (lower.match(/state/)) {
      return Base.addressFields.state();
    }else if (lower.match(/country/)) {
      return Base.addressFields.country();
    } else {
      throw Error(
        `Field [ ${bddFieldName} ] doesn't exist in the map`
      );
    }
  }

  // function is meant for Only profile page and address step in checkout
  static getField (bddPageName: string, bddFieldName: string) {
    const lower = bddPageName.toLowerCase().trim();
    if (lower === "profile") {
      return myProfilePage.getProfileField(bddFieldName);
    } else if (lower === "checkout") {
      return Factory.getAddressField(bddFieldName);
    }
    else {
      throw Error(`Page [ ${bddPageName} ] is Neither profile Nor checkout`)
    }
  };
}
