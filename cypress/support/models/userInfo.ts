import { users } from "../consts";

export type UserInfo = {
  readonly bddName: string;
  readonly EMAIL: string;
  readonly PASSWORD: string;
};

export type Credentials = Omit<UserInfo, "bddName">;

/////// Another way
// export type Credentials = {
//   readonly EMAIL: string;
//   readonly PASSWORD: string;
// };

// export type UserInfo = { readonly bddName: string } & Credentials;

export class User {
  readonly user: UserInfo;
  constructor(bddName: string) {
    this.user = this.findUserByBddName(bddName);

    if (!this.user) {
      cy.log("users dictionary ", users).then(() => {
        throw Error(`User [ ${bddName} ] Not found in users dictionary`);
      });
    }
  }

  private findUserByBddName(bddName: string): UserInfo | undefined {
    for (let key in users) {
      let value: UserInfo = users[key];
      if (value.bddName.trim().toLowerCase() === bddName.trim().toLowerCase()) {
        return value;
      }
    }
    return undefined;
  }
}
