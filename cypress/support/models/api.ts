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
