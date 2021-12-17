/* tslint:disable */
/* eslint-disable */
export interface ProblemDetails {
  detail?: null | string;
  extensions?: { [key: string]: any };
  instance?: null | string;
  status?: null | number;
  title?: null | string;
  type?: null | string;

  [key: string]: any | null | number | string | undefined | { [key: string]: any };
}
