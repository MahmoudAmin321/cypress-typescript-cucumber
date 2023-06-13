import { Credentials } from "./models/userInfo";

/*
 ********************************************************************************
 * Retrieve cypress environment variables
 * This extra-layer file is a good place for frequently used env vars
 ********************************************************************************
 */
export const credentials: { [key: string]: Credentials } = Cypress.env("USERS");
