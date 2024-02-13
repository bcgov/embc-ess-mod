# ERA Helm Chart

This directory contains a Helm chart to deploy ERA

## Usage

To install a new environment, ensure the values.yaml matches the environment, then run the following command:

```sh
helm -n [namespace] install -f envs/[env]/values.yaml [env name] .
```

To upgrade an existing environment, run the following command:

```sh
helm -n [namespace] upgrade -f envs/[env]/values.yaml [env name] .
```
