import { Then, When } from "@badeball/cypress-cucumber-preprocessor";
import entitiesFactory from "../../../pages/admin/entitiesFactory";
import { apis } from "../../../support/consts";
import { Base } from "../../../pages/_common/base.pom";
import { Factory } from "../../../pages/_common/factory";

When(
  "{word} have clicked on {string} button of {int}. {string}",
  function (_: string, bddActionBtn: string, rowNr: number, bddEntity: string) {
    const table = entitiesFactory.getEntity(bddEntity).table;
    const lower = bddActionBtn.toLowerCase();

    if (lower.match(/edit/)) {
      // spy
      // when time comes, handle specific category
      cy.spyApi(apis.specificProduct);

      // click
      table.nthActionBtns(rowNr).edit().click();

      // wait
      // when time comes, handle specific category
      cy.wait(`@${apis.specificProduct.interceptorName}`);
    } else if (lower.match(/delete/)) {
      // spy
      // when time comes, handle categories
      cy.spyApi(apis.products);

      // click
      table.nthActionBtns(rowNr).delete().click();

      // wait
      // when time comes, handle categories
      cy.wait(`@${apis.products.interceptorName}`);
    } else {
      throw Error(`Button [ ${bddActionBtn} ] doesn't exist in the map`);
    }
  }
);

Then(
  "{string} of {int}. {string} is {string}",
  function (
    bddColumnName: string,
    rowNr: number,
    bddEntity: string,
    bddName: string
  ) {
    // get from DOM
    const column = entitiesFactory.getColumnFromDOM(
      bddColumnName,
      bddEntity,
      rowNr
    );

    // assert
    column.invoke("text").then((text) => {
      expect(text.trim().toLowerCase()).to.eq(bddName.trim().toLowerCase());
    });
  }
);

When(
  "You store {string} of {int}. {string}",
  function (bddColumnName: string, rowNr: number, bddEntity: string) {
    // get from DOM
    const column = entitiesFactory.getColumnFromDOM(
      bddColumnName,
      bddEntity,
      rowNr
    );
    column.invoke("text").then((text) => {
      // store
      const columnSetter = entitiesFactory.getColumnSetter(
        bddColumnName,
        bddEntity
      );
      columnSetter(text);
    });
  }
);

When("You save", function () {
  Base.saveBtn().click();
});

When("{word} have saved", function (_: string) {
  // save
  Base.saveBtn().click();

  // make sure, save occurred
  Base.successMsg().should("be.visible");
});

Then(
  "{string} of {int}. {string} {string} {string}",
  function (
    bddColumnName: string,
    rowNr: number,
    bddEntity: string,
    bddAssertion: string,
    bddText: string
  ) {
    let expectedText: string;
    if (
      bddText
        .toLowerCase()
        .trim()
        .match(/as stored/)
    ) {
      expectedText = entitiesFactory.getStoredColumn(bddColumnName, bddEntity);
    } else {
      expectedText = bddText;
    }

    const column = entitiesFactory.getColumnFromDOM(
      bddColumnName,
      bddEntity,
      rowNr
    );
    const assertion = Factory.getAssertion(bddAssertion);
    column.invoke("text").then((text) => {
      const trimmedText = text.trim();
      cy.wrap(trimmedText).should(assertion, expectedText);
    });
  }
);
