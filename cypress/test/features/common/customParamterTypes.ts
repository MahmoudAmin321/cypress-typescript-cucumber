import { defineParameterType } from "@badeball/cypress-cucumber-preprocessor";
import { User } from "../../../support/models/userInfo";

const stringRegex = /"([^"]*)"/;

/**
 * In cucumber scenarios, the parametrized string for user should be (ignoring case) one of the
 * business name properties in "users" object in cypress\support\consts.ts
 * Example -> Given You make dummy step as "aDmIn"
 */
defineParameterType({
  name: "user",
  regexp: stringRegex,
  transformer: (str) => new User(str),
});
