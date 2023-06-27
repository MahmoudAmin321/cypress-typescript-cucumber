import { users } from "../consts";

export type UserInfo = {
  readonly businessName: string;
  readonly EMAIL: string;
  readonly PASSWORD: string;
};

export type Credentials = Omit<UserInfo, "businessName">;

// // Another way
// export type Credentials = {
//   readonly EMAIL: string;
//   readonly PASSWORD: string;
// };

// export type UserInfo = { readonly businessName: string } & Credentials;

export class User {
  readonly user: UserInfo;
  constructor(businessName: string) {
    this.user = this.findUserByBusinessName(businessName);
    if (!this.user) {
      throw Error(
        `User [ ${businessName} ] Not found in users dictionary ${users}`
      );
    }
  }

  private findUserByBusinessName(businessName: string): UserInfo | undefined {
    for (let key in users) {
      let value: UserInfo = users[key];
      if (value.businessName.toLowerCase() === businessName.toLowerCase()) {
        return value;
      }
    }
    return undefined;
  }
}
