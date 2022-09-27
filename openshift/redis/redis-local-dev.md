# Running a Redis cluster locally

1. create a local folder called `redis`
2. create a config file `redis-0.conf` for the first node:

```
port 6380
appendonly no
cluster-enabled yes
cluster-require-full-coverage no
cluster-node-timeout 15000
cluster-config-file /data/nodes.conf
cluster-migration-barrier 1
masteruser default
protected-mode no
save 900 1
save 300 10
save 60 10000
```

3. clone the config file 3 times for 3 nodes, change the port: redis-0.conf: 6380, redis-1.conf: 6381, redis-2.conf: 6382
4. using docker or podman (command is essentially the same), run:
```
podman pull redis:6
```

_The containers must be in the host network, otherwise the cluster won't work as the client won't be able to resolve the redirect commands_

```
podman run -d --rm --name redis-0 -v .\redis\:/conf --net host -p 6380:6380 redis redis-server /conf/redis-0.conf
```

```
podman run -d --rm --name redis-1 -v .\redis\:/conf --net host -p 6381:6381 redis redis-server /conf/redis-1.conf
```

```
podman run -d --rm --name redis-2 -v .\redis\:/conf --net host -p 6382:6382 redis redis-server /conf/redis-2.conf
```

5. once the containers are started, run
```
podman exec -it redis-0 redis-cli --cluster create --cluster-replicas 0 localhost:6380 localhost:6381 localhost:6382
```
6. if the nodes can access each other, type `yes` to accept the cluster config
7. the connection string would be `localhost:6380`