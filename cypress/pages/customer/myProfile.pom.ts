import { apis, customerEndPoint } from "../../support/consts";
import { ApiInfo } from "../../support/models/api";
import { Base } from "../_common/base.pom";
import { Factory } from "../_common/factory";

class MyProfile extends Base {
  readonly relativeUrl = () => `/${customerEndPoint}/profile`;

  readonly profileSection = {
    firstName: () => cy.get("[data-test=first-name]"),
    lastName: () => cy.get("[data-test=last-name]"),
    email: () => cy.get("[data-test=email]"),
    phone: () => cy.get("[data-test=phone]"),
    addressFields: Base.addressFields,
    updateProfileBtn: () => cy.get("[data-test=update-profile-submit]"),
  };

  getApiInfo(): ApiInfo {
    return apis.currentUser;
  }

  waitForPage() {
    return cy.wait(`@${apis.currentUser.interceptorName}`);
  }

  assertPage() {
    cy.url().should("match", new RegExp(`${this.relativeUrl()}$`));
    return this.profileSection.updateProfileBtn().should("be.visible");
  }

  getButton(bddBtnName: string): Cypress.Chainable<any> {
    return null;
  }

  getProfileField(bddFieldName: string) {
    const lower = bddFieldName.toLowerCase();
    const profileFields = this.profileSection;

    if (lower.match(/first(.*)name$/)) {
      return profileFields.firstName();
    } else if (lower.match(/last(.*)name/)) {
      return profileFields.lastName();
    } else if (lower.match(/mail/)) {
      return profileFields.email();
    } else if (lower.match(/phone/)) {
      return profileFields.phone();
    } else {
      return Factory.getAddressField(bddFieldName);
    }
  }
}

const myProfilePage = new MyProfile();
export default myProfilePage;
