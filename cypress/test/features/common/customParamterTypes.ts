import { defineParameterType } from "@badeball/cypress-cucumber-preprocessor";
import { User } from "../../../support/models/userInfo";

const stringRegex = /"([^"]*)"/;

/**
 *
 */
defineParameterType({
  name: "user",
  regexp: stringRegex,
  transformer: (str) => new User(str),
});
