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

export const undefinedNr = 159258753.14951

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
    relativeUrl: () => "/users/me",
  },
  users: {
    interceptorName: "users",
    urlRegex: /users$/,
    relativeUrl: () => "/users",
  },
  usersSearch: {
    interceptorName: "usersSearch",
    urlRegex: /users\/search\?/,
    relativeUrl: () => "/users/search",
  },
  yearsSales: {
    interceptorName: "yearsSales",
    urlRegex: /reports\/total-sales-of-years/,
  },
  categoriesTree: {
    interceptorName: "categoriesTree",
    urlRegex: /categories\/tree/,
  },
  categories: {
    interceptorName: "categories",
    urlRegex: /categories$/,
    relativeUrl: () => "/categories"
  },
  specificCategory: {
    interceptorName: "specificCategory",
    urlRegex: new RegExp(`categories/${dbIdRegex}$`),
    relativeUrl: (categoryId: string) => `/categories/${categoryId}`,
  },
  products: {
    interceptorName: "products",
    urlRegex: /products(.*)\?/,
    relativeUrl: () => "/products"
  },
  specificProduct: {
    interceptorName: "specificProduct",
    urlRegex: new RegExp(`products/${dbIdRegex}$`),
    relativeUrl: (productId: string) => `/products/${productId}`,
  },
  brands: {
    interceptorName: "brands",
    urlRegex: /brands$/,
    relativeUrl: () => "/brands",
  },
  specificBrand: {
    interceptorName: "specificBrand",
    urlRegex: new RegExp(`brands/${dbIdRegex}$`),
    relativeUrl: (brandId: string) => `/brands/${brandId}`,
  },
  brandsSearch: {
    interceptorName: "brandsSearch",
    urlRegex: /brands\/search\?/,
    relativeUrl: () => "/brands/search",
  },
  carts: {
    interceptorName: "carts",
    urlRegex: /carts$/,
    relativeUrl: () => "/carts",
  },
  specificCart: {
    interceptorName: "specificCart",
    urlRegex: new RegExp(`carts/${dbIdRegex}$`),
    relativeUrl: (cartId: string) => `/carts/${cartId}`,
  },
  favorites: {
    interceptorName: "favorites",
    urlRegex: /favorites$/,
    relativeUrl: () => "/favorites",
  },
  specificFavorite: {
    interceptorName: "specificFavorite",
    urlRegex: new RegExp(`favorites/${dbIdRegex}$`),
    relativeUrl: (favoriteId: string) => `/favorites/${favoriteId}`,
  },
  images: {
    interceptorName: "images",
    urlRegex: /images$/,
    relativeUrl: () => "/images",
  },
};
