import { users } from "../../../support/consts";
import loginApi from "./user/loginApi";
import userApi from "./user/userApi";

export abstract class BaseAPI {
  setUp() {
    return null;
  }

  cleanUp() {
    return null;
  }
}
