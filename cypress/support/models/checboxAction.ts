class CheckBoxAction {
  /**
   * Creates a map between business checkbox action (BDD name) and its cypress command
   * @param bddCheckboxAction
   * @param chainableCheckBox
   * @returns The cypress command of the provided BDD name. If the BDD name is invalid, an error is thrown
   */
  perform(
    bddCheckboxAction: string,
    chainableCheckBox: Cypress.Chainable<JQuery<HTMLElement>>
  ) {
    const lower = bddCheckboxAction.toLowerCase();
    if (lower.toLowerCase().match(/^check|^select/)) {
      return chainableCheckBox.check();
    } else if (lower.toLowerCase().match(/uncheck|unselect/)) {
      return chainableCheckBox.uncheck();
    } else {
      throw Error(
        `Checkbox action [ ${bddCheckboxAction} ] doesn't exist in the map`
      );
    }
  }
}

const checkBoxAction = new CheckBoxAction();
export default checkBoxAction;
