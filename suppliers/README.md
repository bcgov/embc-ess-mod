# ERA Suppliers Portal

Supplier facing portal to submit invoices and receipts to EMCR Finance review

## Project Status

![webapp](https://img.shields.io/website?url=https%3A%2F%2Fera-suppliers.embc.gov.bc.ca%2F)

[![suppliers-portal Build](https://github.com/bcgov/embc-ess-mod/actions/workflows/build-suppliers-portal.yml/badge.svg)](https://github.com/bcgov/embc-ess-mod/actions/workflows/build-suppliers-portal.yml)

## Steps to run locally

1. Configure the following as secrets of `EMBC.Registrants.API`:

```json
{
    "Dynamics": {
        "DynamicsApiEndpoint": "[Dynamics server url]/api/data/v9.1/",
        "ADFS": {
            "OAuth2TokenEndpoint": "[ADFS token service url]",
            "ClientId": "[ADFS client id]",
            "ClientSecret": "[ADFS client secret]",
            "ResourceName": "[ADFS resource name]",
            "serviceAccountDomain": "[service account domain name]",
            "serviceAccountName": "[service account name]",
            "serviceAccountPassword": "[service account password]"
        }
    }
}

```

2. run `suppliers/src/API/EMBC.Ssuppliers.API/EMBC.Suppliers.API.csproj`
3. in `suppliers/src/UI/embc-supplier`, run

```sh
npm install --ignore-scripts
```

4. to run the UI with a local API, run

```sh
npm run local
```

5. to run the UI and use the a remote dev environment API, without the needs to run the API locally (step 2), run

```sh
npm run dev
```

6. before committing UI code changes, run the following to ensure the code will pass linting:

```sh
npm run format:write
npm run lint -- --fix
```

7. before committing API code changes, run the unit tests to validate mapping and ensure all tests are green
