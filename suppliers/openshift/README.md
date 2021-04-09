# Openshift setup and configuration

## Templates

### env-promotions.template.yml

Template for an entire supplier portal deployment. Contains 2 deployment configs and attached resources.

API

- Storage
  - submissions storage
  - lookup cache for Dynamics lists
  - data protection keys
- Deployment config for an image based on .net core 3.1 ubuntu image
- General Pathfinder route
- service
- config map for environment variables
- secret for environment variables

UI

- Deployment config for an image based on caddy2 image to service compiled static Angular files and resources
- General Pathfinder route
- service

To create an environment:

1. create a new file named `suppliers-portal.yml.<app name>.params` in the templates directory
2. copy the content from `suppliers-portal.yml.params.template` into the the file and fill in the values, these are the parameters supplied later to the template
3. run the following command (modify the Openshift project to the one you want to deploy to):

```
oc process -f .\suppliers-portal.template.yml --param-file .\suppliers-portal.yml.<app name>.params | oc apply -f -
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

| name       | namespace   | purpose                                                          | url                                                                                                   |
| ---------- | ----------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| dev1       | b5e079-dev  | continiuous deployment from master branch for QA and integration | https://dev1-embc-suppliers.apps.silver.devops.gov.bc.ca/, https://era-suppliers-dev.embc.gov.bc.ca/          |
| test       | b5e079-test | regression and UAT environment                                   | https://test-embc-suppliers.apps.silver.devops.gov.bc.ca/, https://era-suppliers-test.embc.gov.bc.ca/         |
| training   | b5e079-test | training env for field users                                     | https://training-embc-suppliers.apps.silver.devops.gov.bc.ca/, https://era-suppliers-training.embc.gov.bc.ca/ |
| production | b5e079-prod | production environment                                           | https://production-embc-suppliers.apps.silver.devops.gov.bc.ca/, https://era-suppliers.embc.gov.bc.ca/        |
