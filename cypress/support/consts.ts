import { credentials } from "./cyEnvVar";
import { UserInfo } from "./models/userInfo";

// Comment const type to allow syntax error upon accessing non-exiting property
export const users /*: { [key: string]: UserInfo }*/ = {
  admin: { businessName: "Admin", ...credentials.ADMIN },
  user1: { businessName: "User1", ...credentials.USER1 },
  user2: { businessName: "User2", ...credentials.USER2 },
};
