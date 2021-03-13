import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';

export const authConfig: AuthConfig = {

  // Url of the Identity Provider
  issuer: environment.keycloak.issuer,

  // URL of the SPA to redirect the user to after login
  redirectUri: environment.keycloak.redirectUri,

  // The SPA's id.
  // The SPA is registerd with this id at the auth-serverß
  clientId: environment.keycloak.clientId,

  responseType: environment.keycloak.responseType,
  // set the scope for the permissions the client should request
  // The first three are defined by OIDC.
  scope: environment.keycloak.scope,
  // at_hash is not present in JWT token
  showDebugInformation: environment.keycloak.showDebugInformation,
  disableAtHashCheck: environment.keycloak.disableAtHashCheck,
  customQueryParams: { kc_idp_hint: 'bceid' }
};

// export class OAuthModuleConfig {
//     resourceServer: OAuthResourceServerConfig = {sendAccessToken: false};
// }

// export class OAuthResourceServerConfig {
//     /**
//      * Urls for which calls should be intercepted.
//      * If there is an ResourceServerErrorHandler registered, it is used for them.
//      * If sendAccessToken is set to true, the access_token is send to them too.
//      */
//     allowedUrls?: Array<string>;
//     sendAccessToken = true;
//     customUrlValidation?: (url: string) => boolean;
// }
