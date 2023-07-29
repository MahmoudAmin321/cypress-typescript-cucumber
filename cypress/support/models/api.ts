import { apis } from "../consts";

export type ApiInfo = {
  readonly interceptorName: string;
  readonly urlRegex: RegExp;
  readonly relativeUrl?: (...args) => string;
};

export type stubApiArgs = {
  readonly api: ApiInfo;
  readonly method?: string;
  readonly times?: number;
  readonly statusCode?: number;
  readonly resBody?: object | string | any[];
};

class ApisFactory {
  getApi(bddName: string): ApiInfo {
    const lower = bddName.toLowerCase();
    if (lower.match(/^products$/)) {
      return apis.products;
    } else if (lower.match(/this product/)) {
      return apis.specificProduct;
    } else {
      throw Error(`Api ${bddName} Not found in the map`);
    }
  }
}

export const apisFactory = new ApisFactory();
