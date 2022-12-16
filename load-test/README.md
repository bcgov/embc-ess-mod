# ERA Load Test scripts

## Features

- generates load based on real world use cases on the system
- supports load test, stress test and benchmark scenarios

## Installation

Prerequisite: 
- node.js
- k6 cli (https://k6.io/docs/getting-started/installation/)

1. in `load-test/src/`, run `npm install`
2. clone `load-test.parameters-template.ts` to `load-test.parameters-dev.ts`
3. modify `load-test.parameters-dev.ts` to the correct settings in dev environment


## Usage

Webpack is used to dynamically set the parameters import. By default there is a empty template file.
It is configured that if you run one of the load test scripts, it expects to find a dev parameters file. This can be shared by the team.
This can also be customized to whatever you want by updating the NormalModuleReplacementPlugin in webpack.config.js

There are multiple test entry points configured in package.json (regAnonymous, regNewProfile, regExistingProfile, resNewRegistration, resExistingRegistration, loadTest, benchmark)
e.g.

```
npm run <scriptName>
```

Responder and Registrant tests can be run independantly. They will by default do 1 vu and 1 iteration, but you can dynamically set those with arguments. e.g.

```
npm run regAnonymous -- -e VUS=# -e ITERS=#
npm run resNewRegistration -- -e VUS=# -e DUR=#t
```

Argument options:
VUS - number of virtual users
ITERS - number of iterations each vu should perform
DUR - duration of run (if provided each VU will run for the duration provided instead of a set number of iterations)

DUR is of format <number> + <time descriptor>
e.g. "5m" = 5 minutes. "10s" = 10 seconds, "1h" = 1 hour, "1h30m" = 1 hour and 30 minutes


There is a benchmark test configured to run the distribution matrix defined in the Load Testing plan.
You can pass this a parameter for the number of vus to run for this benchmark. (Will default to one vu each)
By defaul this will run for a duration of 5 minutes.
You can optionally pass in an iteration count for each vu to do instead of a set 5m duration.

```
npm run benchmark --- -e VUS=#
npm run benchmark --- -e VUS=# -e ITERS=#
```


## Configuring test users

Oauth server supports a special test-client configuration to allow automated tools like load test generators, security scanners, to obtain a token programmatically using 'resource owner password' OIDC flow.

The test client is configured only for non production environments and requires a pre provisioned client id/secret to authenticate.

The following commands will create a config map from a file, attach it as a volume to the pods, and set the env var that tells the server where to find the test users data file. 

```cmd
oc -n <repalcewith_licenseplate>-dev create configmap oauth-server-test-users --from-file .\test-users.json
oc -n <repalcewith_licenseplate>-dev set volume deployment/dev-oauth-server-deployment --add --configmap-name oauth-server-test-users --mount-path /data
oc -n <repalcewith_licenseplate>-dev set env deployment/dev-oauth-server-deployment IDENTITYSERVER_TESTUSERS_FILE=/data/test-users.json
```

Test users can be generated using the following format:

```[
    {
        "sub": "<unique id - i.e. same as username>",
        "userName": "<username>",
        "password": "<password>",
        "aud": "<audience>",
        "birthdate": "yyyy-mm-dd",
        "address": {
            "street_address": "<address>",
            "country": "CA",
            "formatted": "<address>\n<city>, BC  <postal code>",
            "locality": "<city>",
            "region": "BC",
            "postal_code": "<postal code>"
        },
        "iss": "<issuer>",
        "given_name": "<first name>",
        "display_name": "<full name>",
        "family_name": "<last name>"
    },...]
```