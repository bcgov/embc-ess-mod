export const environment = {
  production: true,
  version: '1.0.0',
  keycloak: {
    issuer: 'https://dev.oidc.gov.bc.ca/auth/realms/udb1ycga',
    redirectUri: window.location.origin + '/',
    clientId: 'responder-portal',
    scope: 'openid profile email offline_access',
    responseType: 'code',
    // at_hash is not present in JWT token
    disableAtHashCheck: true,
    showDebugInformation: true
  }
};
