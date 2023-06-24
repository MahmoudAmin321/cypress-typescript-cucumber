import { Credentials } from "./models/userInfo";

/*
 ********************************************************************************
 * Retrieve cypress environment variables
 * This extra-layer file is a good place for frequently used env vars
 ********************************************************************************
 */
export const credentials: { [key: string]: Credentials } = Cypress.env("USERS");

const currentTestEnv: string = Cypress.env("CURRENT_TESTING_ENV");

export const uiHost: string =
  Cypress.env("TESTING_ENVS")[currentTestEnv]["UI_HOST"];

export const apiHost: string =
  Cypress.env("TESTING_ENVS")[currentTestEnv]["API_HOST"];
