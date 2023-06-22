import { credentials } from "./cyEnvVar";
import { ApiInfo } from "./models/apiInfo";
import { UserInfo } from "./models/userInfo";

// Comment const type to allow syntax error upon accessing non-exiting property
export const users /*: { [key: string]: UserInfo }*/ = {
  admin: { businessName: "Admin", ...credentials.ADMIN },
  customer1: { businessName: "Customer1", ...credentials.CUSTOMER1 },
  customer: { businessName: "Customer2", ...credentials.CUSTOMER2 },
};

export const adminEndPoint = "admin";

export const customerEndPoint = "account";

// Comment const type to allow syntax error upon accessing non-exiting property
export const apis /*: { [key: string]: ApiInfo }*/ = {
  currentUser: {
    interceptorName: "currentUser",
    urlRegex: /users\/me$/,
  },
  dummyApi: {
    interceptorName: "dummyInterceptorName",
    urlRegex: /dummy regex/,
    relativeUrl: (param: string) => `dynamic/${param}/dummyUrl`,
  },
};
