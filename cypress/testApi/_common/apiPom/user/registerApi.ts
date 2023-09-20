import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";
import { BaseAPI } from "../base.apiPom";

class RegisterApi extends BaseAPI {
  readonly unregisteredEmail = Cypress.env("UNREGISTERED_CREDENTIALS")["EMAIL"];
  unregisteredPW = Cypress.env("UNREGISTERED_CREDENTIALS")["PASSWORD"];

  registrationData = {
    first_name: "test",
    last_name: "Doe",
    address: "Street 1",
    city: "City",
    state: "State",
    country: "Country",
    postcode: "1234AA",
    phone: "0987654321",
    dob: "1970-01-01",
    email: this.unregisteredEmail,
    password: this.unregisteredPW,
  };

  userId: string;

  register(reqBody: object): Cypress.Chainable<Cypress.Response<any>> {
    return cy.request({
      url: `${apiHost}${apis.register.relativeUrl()}`,
      method: "POST",
      body: reqBody,
      failOnStatusCode: false,
    });
  }

  setUp() {
    return registerApi
      .register(registerApi.registrationData)
      .then((registerResp) => {
        // Make sure user is registered
        expect(registerResp.status).to.eq(201);
        const actualEmail: string = registerResp.body.email;
        const userId: string = registerResp.body.id;
        expect(actualEmail).to.eq(registerApi.registrationData.email);

        return { registeredEmail: actualEmail, userId };
      });
  }

  resetRegistrationData() {
    this.registrationData = {
      first_name: "test",
      last_name: "Doe",
      address: "Street 1",
      city: "City",
      state: "State",
      country: "Country",
      postcode: "1234AA",
      phone: "0987654321",
      dob: "1970-01-01",
      email: this.unregisteredEmail,
      password: this.unregisteredPW,
    };
  }
}

const registerApi = new RegisterApi();
export default registerApi;
