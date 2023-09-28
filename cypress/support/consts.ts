import { credentials } from "./cyEnvVar";

// Comment const type to allow syntax error upon accessing non-exiting property
export const users /*: { [key: string]: UserInfo }*/ = {
  admin: { bddName: "Admin", ...credentials.ADMIN },
  customer1: { bddName: "Customer1", ...credentials.CUSTOMER1 },
  customer2: { bddName: "Customer2", ...credentials.CUSTOMER2 },
};

export const adminEndPoint = "admin";

export const customerEndPoint = "account";

export const tokenKeyName = "auth-token";

export const tokenAliasName = "token";

export const dbIdRegex = "[\\d\\w]+";

// Comment const type to allow syntax error upon accessing non-exiting property
export const apis /*: { [key: string]: ApiInfo }*/ = {
  register: {
    interceptorName: "register",
    urlRegex: /users\/register$/,
    relativeUrl: () => "/users/register",
  },
  login: {
    interceptorName: "login",
    urlRegex: /users\/login$/,
    relativeUrl: () => "/users/login",
  },
  logout: {
    interceptorName: "logout",
    urlRegex: /users\/logout$/,
    relativeUrl: () => "/users/logout",
  },
  refreshToken: {
    interceptorName: "refreshToken",
    urlRegex: /users\/refresh$/,
    relativeUrl: () => "/users/refresh",
  },
  forgotPW: {
    interceptorName: "forgotPW",
    urlRegex: /users\/forgot-password$/,
    relativeUrl: () => "/users/forgot-password",
  },
  changePW: {
    interceptorName: "changePW",
    urlRegex: /users\/change-password$/,
    relativeUrl: () => "/users/change-password",
  },
  specificUser: {
    interceptorName: "specificUser",
    urlRegex: /users\/\d+$/,
    relativeUrl: (userId: string) => `/users/${userId}`,
  },
  currentUser: {
    interceptorName: "currentUser",
    urlRegex: /users\/me$/,
  },
  users: {
    interceptorName: "users",
    urlRegex: /users$/,
    relativeUrl: () => "/users",
  },
  yearsSales: {
    interceptorName: "yearsSales",
    urlRegex: /reports\/total-sales-of-years/,
  },
  categoriesTree: {
    interceptorName: "categoriesTree",
    urlRegex: /categories\/tree/,
  },
  products: {
    interceptorName: "products",
    urlRegex: /products(.*)\?/,
  },
  brands: {
    interceptorName: "brands",
    urlRegex: /brands$/,
  },
  specificProduct: {
    interceptorName: "specificProduct",
    urlRegex: new RegExp(`products/${dbIdRegex}$`),
    relativeUrl: (productId: string) => `/products/${productId}`,
  },
};
