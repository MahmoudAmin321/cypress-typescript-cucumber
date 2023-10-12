import { defineParameterType } from "@badeball/cypress-cucumber-preprocessor";
import { User } from "../../support/models/userInfo";
import { SortOptions } from "../../support/models/sort/_sortOptions";
import { DetailOfProduct } from "../../support/models/productDetails";

const wordRegex = /"^\w+$"/;
const stringRegex = /"([^"]*)"/;

/**
 * In cucumber scenarios, the parametrized string for user should be (ignoring case) one of the
 * business (bdd) name properties in "users" object in cypress\support\consts.ts
 * Example -> Given You make dummy step as "aDmIn"
 */
defineParameterType({
  name: "user",
  regexp: stringRegex,
  transformer: (str) => new User(str),
});

defineParameterType({
  name: "sortOption",
  regexp: stringRegex,
  transformer: (str) => new SortOptions(str),
});

defineParameterType({
  name: "productDetail",
  regexp: stringRegex,
  transformer: (str) => new DetailOfProduct(str),
});