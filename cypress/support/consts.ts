import { credentials } from "./cyEnvVar";

// Comment const type to allow syntax error upon accessing non-exiting property
export const users /*: { [key: string]: UserInfo }*/ = {
  admin: { businessName: "Admin", ...credentials.ADMIN },
  customer1: { businessName: "Customer1", ...credentials.CUSTOMER1 },
  customer2: { businessName: "Customer2", ...credentials.CUSTOMER2 },
};

export const adminEndPoint = "admin";

export const customerEndPoint = "account";

export const tokenKeyName = "auth-token";

// Comment const type to allow syntax error upon accessing non-exiting property
export const apis /*: { [key: string]: ApiInfo }*/ = {
  register: {
    interceptorName: "register",
    urlRegex: /users\/register$/,
    relativeUrl: () => `/users/register`,
  },
  login: {
    interceptorName: "login",
    urlRegex: /users\/login$/,
    relativeUrl: () => `/users/login`,
  },
  specificUser: {
    interceptorName: "specificUser",
    urlRegex: /users\/\d+$/,
    relativeUrl: (userId: number) => `/users/${userId}`,
  },
  currentUser: {
    interceptorName: "currentUser",
    urlRegex: /users\/me$/,
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
    urlRegex: /products\?/,
  },
  brands: {
    interceptorName: "brands",
    urlRegex: /brands$/,
  },
  specificProduct: {
    interceptorName: "specificProduct",
    urlRegex: /products\/\d+$/,
    relativeUrl: (productId: string) => `/products/${productId}`,
  },
};
