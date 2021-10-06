# Redis HA cluster

Redis HA cluster template, based on https://gist.github.com/jujaga/7048148a7c960d6a910ff29f33565407

## Objects in the template
- image stream for redis 6 alpine
- stateful set for redis pods + config and secrets
- service to expose the cluster to other pods
- network policy with internal cluster and namespace access


## How to set up?
1. clone the  template file and set the parameters according to the namespace's details. The template has more parameters that can be set.
1. authenticate openshift cli (oc login..)
1. run the following command:
```cmd
oc process -f deployment-config.template.yml --param-file <the param file>  | oc apply -f -
```
1. to create the cluster, run the following command:
```cmd
oc exec -it redis-<instance>-0 -- redis-cli --cluster create --cluster-replicas 1 $(oc get pods -l role=redis -o jsonpath='{range.items[*]}{.status.podIP}:6379 ')
```

>if you use powershell, get the IPs first, then paste into the above command
1. accept the cluster configuration

## How to connect a client?

1. note the password that was created by the template
2. point the redis client to the service name, i.e. redis-<app name>:6379, and use the password to authenticate.  
For example, .net core uses [StackExchange.Redis](https://stackexchange.github.io/StackExchange.Redis/Configuration.html), and the connection string will be ```redis-dev:6379,password=somepassword```

## Testing

To test cluster failover scenarios, follow the tutorial [here](https://redis.io/topics/cluster-tutorial). cli syntax and commands can be found [here](https://redis.io/topics/rediscli) 

To test connectivity, use `oc port-forward` and try to connect using a local copy of `redis-cli` or any client code.