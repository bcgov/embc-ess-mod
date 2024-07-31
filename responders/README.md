# ERA Responders Portal

The responders and managment facing portal

## Project Status

![webapp](https://img.shields.io/website?url=https%3A%2F%2Fera-responders.embc.gov.bc.ca%2F)

[![responders-portal Build](https://github.com/bcgov/embc-ess-mod/actions/workflows/build-responders-portal.yml/badge.svg)](https://github.com/bcgov/embc-ess-mod/actions/workflows/build-responders-portal.yml)

## Steps to run locally

1. Configure the following as secrets in `EMBC.Responders.API.csproj`:

```json
{
  "jwt": {
    "metadataAddress": "https://dev.loginproxy.gov.bc.ca/auth/realms/standard/.well-known/openid-configuration",
    "audience": "[CSS client id]"
  },
  "oidc": {
    "clientId": "[CSS client id]",
    "issuer": "https://dev.loginproxy.gov.bc.ca/auth/realms/standard",
    "bceidLogoutUrl": "https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi",
  },
  "messaging": {
    "authorizationEnabled": "true",
    "oauth": {
      "metadataAddress": "[oauth server url in OpenShift or local]/.well-known/openid-configuration",
      "clientId": "[API client id as configured in oauth server configuration]",
      "clientSecret": "[API client secret as configured in oauth server configuration]",
      "scope": "ess-backend"
    }
  }
}
```

2. to run the API locally, run the following projects:

```ess/src/API/EMBC.ESS.Host/EMBC.ESS.Host.csproj```

```responders/src/API/EMBC.Responsers.API/EMBC.Responders.API.csproj```

3. in `responders/src/UI/embc-responder`, run

```sh
npm install --ignore-scripts
```

4. to run the UI with a local API, run

```sh
npm start
```

5. to run the UI and use the a remote dev environment API, without the needs to run the API locally (step 2), run

```sh
npm run start-prj
```

```sh
npm run start-sup
```

6. to auto generate the API client side code, run the one of the following (depends on which environment has the API changes):

```sh
npm run gen-api-local
npm run gen-api-prj
npm run gen-api-sup
```

7. before committing UI code changes, run the following to ensure the code will pass linting:

```sh
npm run format:write
npm run lint -- --fix
```

8. before committing API code changes, run the unit tests to validate mapping and ensure all tests are green
