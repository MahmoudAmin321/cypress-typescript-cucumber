import { apis } from "../../../../support/consts";
import { apiHost } from "../../../../support/cyEnvVar";

class RegisterApi {
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
    email: "test23@test.test",
    password: "welcome01",
  };

  userId: number;

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
        const userId: number = registerResp.body.id;
        expect(actualEmail).to.eq(registerApi.registrationData.email);

        return { registeredEmail: actualEmail, userId };
      });
  }

  resetReistrationData() {
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
      email: "test23@test.test",
      password: "welcome01",
    };
  }
}

const registerApi = new RegisterApi();
export default registerApi;
