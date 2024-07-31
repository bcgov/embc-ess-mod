
# ERA Registrants Portal

The registration and evacuee facing portal

## Project Status

![webapp](https://img.shields.io/website?url=https%3A%2F%2Fera-evacuees.embc.gov.bc.ca%2F)

[![registrant-portal Build](https://github.com/bcgov/embc-ess-mod/actions/workflows/build-registrants-portal.yml/badge.svg)](https://github.com/bcgov/embc-ess-mod/actions/workflows/build-registrants-portal.yml)

## Steps to run locally

1. Configure the following as secrets of `EMBC.Registrants.API`:

```json
{
    "auth": {
        "introspection": {
            "authority": "[oauth server url in OpenShift or local]",
            "clientid": "[API client id as configured in oauth server configuration]",
            "clientsecret": "[API client secrets as configured in oauth server configuration]"
        },
        "jwt": {
            "authority": "[oauth server url in OpenShift or local]"
        },
        "oidc": {
            "issuer": "[oauth server url in OpenShift or local]",
            "clientid": "[UI client id as configured in oauth server configuration]"
        }
    },
    "messaging": {
        "authorizationEnabled": "true",
        "oauth": {
            "metadataAddress": "[oauth server url in OpenShift or local]/.well-known/openid-configuration",
            "clientId": "[API client id as configured in oauth server configuration]",
            "clientSecret": "[API client secrets as configured in oauth server configuration]",
            "scope": "ess-backend"
        }
    },
    "captcha": {
        "automation": "[optional automation captcha value as configured in the automation test suite]"
    }
}
```

2. to run the API locally, run the following projects:

```/ess/src/API/EMBC.ESS.Host/EMBC.ESS.Host.csproj```

```/registrants/src/API/EMBC.Registrants.API/EMBC.Registrants.API.csproj```

3. in `registrants/src/UI/embc-registrant`, run

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
