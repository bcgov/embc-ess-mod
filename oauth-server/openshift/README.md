# Openshift setup and configuration

## Templates

### oauth-server.template.yml

Template for an OAuth server deployment.

- Storage
  - data protection keys
  - shared private key for gRPC ssl
- Deployment config for an image based on .net core 3.1 ubuntu image
- service
- config map for environment variables
- secret for environment variables

To create an environment:

1. create a new file named `oauth-server.yml.<app name>.params` in the templates directory
1. copy the content from `oauth-server.yml.params.template` into the file and fill in the values, these are the parameters supplied later to the template
1. login to openshift cli `oc login ... --token=...`
1. switch to the correct namespace `oc project <openshift namespace>`
1. run the following command from cmd/powershell console (modify the Openshift project to the one you want to deploy to):

```cmd
oc process -f .\oauth-server.template.yml --param-file .\oauth-server.yml.<app name>.params | oc apply -f -
```

4. to update an existing environment, modify the templates and params, then execute the same command.

**Note: executing `oc apply` WILL trigger deployment, to test the changes add `--dry-run` at the end of the command**

## Configuring test users

Oauth server supports a special test-client configuration to allow automated tools like load test generators, security scanners, to obtain a token programmatically using 'resource owner password' OIDC flow.

The test client is configured only for non production environments and requires a pre provisioned client id/secret to authenticate.

The following commands will create a config map from a file, attach it as a volume to the pods, and set the env var that tells the server where to find the test users data file. [this file](https://github.com/bcgov/embc-ess-mod/blob/master/oauth-server/src/OAuthServer/Data/test_users.json) is an example of a test users data file.

```cmd
oc create configmap oauth-server-test-users --from-file .\test-users.json
oc set volume dc/oauth-server --add --configmap-name oauth-server-test-users --mount-path /data
oc set env dc/oauth-server IDENTITYSERVER_TESTUSERS_FILE=/data/test-users.json
```