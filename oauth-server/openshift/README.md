# Openshift setup and configuration

## Creating or updating the service

Template for an OAuth server deployment.

To create an environment:

1. create a new file named `oauth-server.<app name>.params` (do not commit to github!)
1. copy the content from `oauth-server.yml.params.template` into the file and fill in the values, these are the parameters supplied later to the template
1. login to openshift cli `oc login ... --token=...`
1. run the following command to create or update the template objects:

```cmd
oc process -f oauth-server.template.yml --param-file oauth-server.yml.<app name>.params | oc apply -f -
```

**Note: executing `oc apply` WILL roll out new pods, to test the changes add `--dry-run` at the end of the command**

## Configuring the OIDC server

The server configuration is based on json file which schema can be replicated from [this file](https://github.com/bcgov/embc-ess-mod/blob/master/oauth-server/src/OAuthServer/Data/config.json).

To configure the server in OpenShift:
1. clone the file and modify according to the expected clients.
1. mount the file as a configmap:

```shell
oc create configmap oauth-server-config --from-file .\config.json
oc set volume dc/oauth-server --add --configmap-name oauth-server-config --mount-path /data
oc set env dc/oauth-server IDENTITYSERVER_CONFIG_FILE=/data/config.json
```
## Configuring test users

Oauth server supports a special test-client configuration to allow automated tools like load test generators, security scanners, to obtain a token programmatically using 'resource owner password' OIDC flow.

The test client is configured only for non production environments and requires a pre provisioned client id/secret to authenticate.

The following commands will create a config map from a file, attach it as a volume to the pods, and set the env var that tells the server where to find the test users data file. [this file](https://github.com/bcgov/embc-ess-mod/blob/master/oauth-server/src/OAuthServer/Data/test_users.json) is an example of a test users data file.

```cmd
oc create configmap oauth-server-test-users --from-file .\test-users.json
oc set volume dc/oauth-server --add --configmap-name oauth-server-test-users --mount-path /data
oc set env dc/oauth-server IDENTITYSERVER_TESTUSERS_FILE=/data/test-users.json
```