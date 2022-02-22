# Openshift setup and configuration

## Templates

### ess-backend.template.yml

Template for an ESS back-end deployment.

- Storage
  - data protection keys
  - shared private key for gRPC ssl
- Deployment config for an image based on .net core 3.1 ubuntu image
- service
- config map for environment variables
- secret for environment variables

To create an environment:

1. create a new file named `ess-backend.yml.<app name>.params` in the templates directory
1. copy the content from `ess-bacjend.yml.params.template` into the file and fill in the values, these are the parameters supplied later to the template
1. login to openshift cli `oc login ... --token=...`
1. switch to the correct namespace `oc project <openshift namespace>`
1. run the following command from cmd/powershell console (modify the Openshift project to the one you want to deploy to):

```cmd
oc process -f .\ess-backend.template.yml --param-file .\ess-backend.yml.<app name>.params | oc apply -f -
```

4. to update an existing environment, modify the templates and params, then execute the same command.

**Note: executing `oc apply` WILL trigger deployment, to test the changes add `--dry-run` at the end of the command**

### env-promotions.template.yml

A template for Openshift pipelines to allow deployments to higher environments.

Run the following command to create 3 pipelines for test, training and production:

```
oc process -f .\env-promotions.template.yml | oc -n <openshift namespace>-tools apply -f -
```

**Note: make sure to run this command in tools namespace of your project, it will ensure there's a jenkins instance available to invoke the pipeline commands**

# Environments

| name       | namespace   | purpose                                                          
| ---------- | ----------- | ---------------------------------------------------------------- 
| dev1       | b5e079-dev  | continiuous deployment from master branch for QA and integration 
| test       | b5e079-test | regression and UAT environment                                   
| training   | b5e079-test | training env for field users                                     
| production | b5e079-prod | production environment                                           
