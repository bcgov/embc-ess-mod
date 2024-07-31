# Helm charts for ERA

## [era chart](./era/)

This is the main gitops configuration chart for the system.

## [redis-sentinel chart](./redis-sentinel/)

This is a supporting chart that deploys Redis Sentinal in OpenShift.

## [tools chart](./tools/)

This is a support chart to the tools namespace and it is the gitops chart to support CD and environment promotion workflows.

This chart will install the following:

- Image streams for each component
- Tekton pipelines to promote the system to higher environments (test/training/prod)
- Tekton pipelines to configure a dev environment to a specific tag, which in most times will be a release branch
