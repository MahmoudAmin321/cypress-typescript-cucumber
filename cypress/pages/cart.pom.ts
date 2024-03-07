import { apis, undefinedNr } from "../support/consts";
import { ApiInfo } from "../support/models/api";
import { CartColumn } from "../support/models/cartColumn";
import { Base } from "./_common/base.pom";

class Cart extends Base {
  readonly relativeUrl = () => `/checkout`;
  readonly cart = () => cy.get("[steptitle=Cart]");
  readonly itemsTable = {
    headerCells: () => this.cart().find("thead > tr > th"),
    items: () => this.cart().find("tbody > tr"),
    footerCells: () => this.cart().find("tfoot > tr > td"),
  };

  readonly proceedToCheckout = () => cy.get("[data-test=proceed-1]");

  getApiInfo(): ApiInfo {
    return apis.specificCart;
  }

  waitForPage() {
    return cy.wait(`@${apis.specificCart.interceptorName}`);
  }

  getButton(bddBtnName: string): Cypress.Chainable<any> {
    if (bddBtnName.toLowerCase().match(/proceed to checkout/)) {
      return this.proceedToCheckout();
    } else {
      throw Error(`Button [ ${bddBtnName} ] doesn't exist in the map`);
    }
  }

  getColumnIndex(columnName: string): Cypress.Chainable<number> {
    return this.itemsTable.headerCells().then((headerCells: any) => {
      for (let i = 0; i < headerCells.length; i++) {
        const headerCell: HTMLElement = headerCells[i];
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
    const cartChainableItems = this.itemsTable.items();
    // search item in cart
    return Base.searchInItems(cartChainableItems, bddItemName).then((itemIndex) => {
      return cy.then(() => {
        if (itemIndex == undefinedNr) {
          throw Error(`Item ${bddItemName} doesn't exist in the cart`);
        }
        return this.getColumnIndex(bddCartColumn.name).then((columnIndex) => {
          return this.itemsTable
            .items()
            .eq(itemIndex)
            .find("td").eq(columnIndex)
        });
      });
    });
  }
}

const cartPage = new Cart();
export default cartPage;
