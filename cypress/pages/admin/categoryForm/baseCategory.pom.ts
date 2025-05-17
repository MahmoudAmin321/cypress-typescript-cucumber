import { Base } from "../../_common/base.pom";

export class BaseCategory extends Base {
  readonly relativeUrl: (...args: any[]) => string;

  readonly textFields = {
    name: () => cy.get("[data-test=name]"),
    slug: () => cy.get("[data-test=slug]"),
  };

  readonly dropdowns = {
    parentId: () => cy.get("[data-test=parent-id]"),
  };

  readonly options = (DDL: Cypress.Chainable<JQuery<HTMLElement>>) =>
    DDL.children("option");

  readonly save = () => cy.get("[data-test=parent-category-submit]");

  readonly back = () => cy.get("[data-test=back]");

  waitForPage() {
    return null;
  }
  getButton(bddBtnName: string): Cypress.Chainable<any> {
    // Page has No uncommon buttons so far
    return null;
  }

  getTextField(bddTextFieldName: string) {
    const lower = bddTextFieldName.toLowerCase();
    const textFields = this.textFields;

    if (lower.match(/name/)) {
      return textFields.name();
    } else if (lower.match(/slug/)) {
      return textFields.slug();
    } else {
      throw Error(
        `Text field [ ${bddTextFieldName} ] doesn't exist in the map`
      );
    }
  }

  getDropdown(bddDropdownName: string) {
    const lower = bddDropdownName.toLowerCase();
    const dropdowns = this.dropdowns;

    if (lower.match(/parent/)) {
      return dropdowns.parentId();
    } else {
      throw Error(`Dropdown [ ${bddDropdownName} ] doesn't exist in the map`);
    }
  }
}
