import { users } from "../../../support/consts";
import loginApi from "./user/loginApi";
import userApi from "./user/userApi";

export abstract class BaseAPI {
  /**
   * Deletes the created entity as a cleanup action.
   * Note: Ideally, a script for clearing test data from the database
   * should be executed in a beforeEach hook, but as this automation project uses a deployed (Not local) version
   * of the SUT, a workaround is used to avoid flakiness
   *
   * @param id The id of the entity (user, product, ...etc.) to be deleted
   */
  cleanUp(id: number) {
    return null;
  }

  setUp() {
    return null;
  }
}
