import { apis, undefinedNr } from "../support/consts";
import { ApiInfo } from "../support/models/api";
import { CartColumn } from "../support/models/cartColumn";
import { Base } from "./_common/base.pom";
import loginPage from "./login.pom";

class Cart extends Base {
  readonly relativeUrl = () => `/checkout`;

  readonly cartStep = {
    container: () => cy.get("app-cart"),

    itemsTable: {
      headerCells: () => this.cartStep.container().find("thead > tr > th"),

      items: () =>
        this.cartStep
          .container()
          .find("tbody > tr")
          .should(($items) => {
            if ($items.length === 0) {
              // If No items found, return undefinedNr
              return undefinedNr;
            }
          }),

      footerCells: () => this.cartStep.container().find("tfoot > tr > td"),
    },

    proceedBtn: () => cy.get("[data-test=proceed-1]"),
  };

  readonly signInStep = {
    container: () => cy.get("app-login"),
    email: () => loginPage.form.email(),
    proceedBtn: () => cy.get("[data-test=proceed-2]"),
  };

  readonly addressStep = {
    container: () => cy.get("app-address"),
    addressFields: Base.addressFields,
    proceedBtn: () => cy.get("[data-test=proceed-3]"),
  };

  readonly paymentStep = {
    container: () => cy.get("app-payment"),
    paymentMethod: () => cy.get("[data-test=payment-method]"),
    proceedBtn: () => cy.get("[data-test=finish]"),
  };

  getApiInfo(): ApiInfo {
    return apis.specificCart;
  }

  waitForPage() {
    return cy.wait(`@${apis.specificCart.interceptorName}`);
  }

  getStep(bddStepName: string) {
    const lowerTrimmed = bddStepName.toLowerCase().trim();
    if (lowerTrimmed.match(/cart/)) {
      return this.cartStep;
    } else if (lowerTrimmed.match(/sign(-| )*in/)) {
      return this.signInStep;
    } else if (lowerTrimmed.match(/address/)) {
      return this.addressStep;
    } else if (lowerTrimmed.match(/payment/)) {
      return this.paymentStep;
    } else {
      throw Error(`step [ ${bddStepName} ] doesn't exist in the map`);
    }
  }

  getButton(bddBtnName: string): Cypress.Chainable<any> {
    return null;
  }

  getColumnIndex(columnName: string): Cypress.Chainable<number> {
    return this.cartStep.itemsTable.headerCells().then(($headerCells) => {
      const headerCellsArray: HTMLElement[] = $headerCells.toArray();
      if (
        columnName
          .trim()
          .toLowerCase()
          .match(/delete/)
      ) {
        // return last index of the array
        return headerCellsArray.length - 1;
      }

      for (let i = 0; i < headerCellsArray.length; i++) {
        const headerCell: HTMLElement = headerCellsArray[i];
        if (
          headerCell.innerText
            .trim()
            .toLowerCase()
            .match(RegExp(columnName.trim().toLowerCase()))
        ) {
          // return index of the found item
          return i;
        }
      }
    });
  }

  getItemCell(
    bddCartColumn: CartColumn,
    bddItemName: string
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    const cartChainableItems = this.cartStep.itemsTable.items();
    // search item in cart
    return Base.searchInItems(cartChainableItems, bddItemName).then(
      (itemIndex) => {
        return cy.then(() => {
          if (itemIndex == undefinedNr) {
            throw Error(`Item ${bddItemName} doesn't exist in the cart`);
          }
          return this.getColumnIndex(bddCartColumn.name).then((columnIndex) => {
            return this.cartStep.itemsTable
              .items()
              .eq(itemIndex)
              .find("td")
              .eq(columnIndex);
          });
        });
      }
    );
  }
}

const cartPage = new Cart();
export default cartPage;
