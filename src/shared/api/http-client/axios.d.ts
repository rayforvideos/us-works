import "axios";

declare module "axios" {
  interface AxiosRequestConfig<D = any> {
    skipAuth?: boolean;
    authRetried?: boolean;
    authExpiryChecked?: boolean;
  }
}
