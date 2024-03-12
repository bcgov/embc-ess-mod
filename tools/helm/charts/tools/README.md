# ERA Tools Helm Chart

This chart contains tools specific resources to support ERA deployments.

## Usage

To install or upgrade, run the following command :

To install a new environment, ensure the values.yaml matches the environment, then run the following command:

```sh
helm -n [namespace] install [env name] .
```

To upgrade an existing environment, run the following command:

```sh
helm -n [namespace] upgrade [env name] .
```
