export type ApiInfo = {
  readonly interceptorName: string;
  readonly urlRegex: RegExp;
  readonly relativeUrl?: (...args) => string;
};
