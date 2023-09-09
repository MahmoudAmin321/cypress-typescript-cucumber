import { Given, When } from "@badeball/cypress-cucumber-preprocessor";
import keyboardFactory from "../../../support/models/keyboardFactory";
import { Base } from "../../../pages/_common/base.pom";
import pagesFactory from "../../../pages/_common/pagesFactory";

// Anti pattern. Only use as exception, when there is No other option
Given("{word} wait {int} seconds", function (_: string, seconds: number) {
  cy.wait(seconds * 1000);
});

When(
  "{word} hit {string} key {int} times",
  function (_: string, bddKeyName: string, times: number) {
    if (times % 2 != 0) {
      throw Error(
        `Instead of ${times} Please provide even number, as cypress hits the key twice, which is weird to me`
      );
    }
    const key = keyboardFactory.getKey(bddKeyName);

    for (let i = 0; i < times / 2; i++) {
      Base.body().type(key);
    }
  }
);

When(
  "{word} set text field {string} of {string} page to {string}",
  function (
    _: string,
    bddTextFieldName: string,
    bddPageName: string,
    bddIncomigValue: string
  ) {
    const page: Base = pagesFactory.getPage(bddPageName);
    const textField = page.getTextField(bddTextFieldName);

    textField.clear().type(bddIncomigValue);
  }
);

When(
  "{word} set dropdown {string} of {string} page to {string}",
  function (
    _: string,
    bddDropdownName: string,
    bddPageName: string,
    bddIncomigOption: string
  ) {
    const page: Base = pagesFactory.getPage(bddPageName);
    const dropdown = page.getDropdown(bddDropdownName);

    dropdown.select(bddIncomigOption);
  }
);
