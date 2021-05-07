需要配置的环境变量有
```
APISIX_ADDRESS=http://172.16.101.123:9080
NACOS_ADDRESS=172.16.101.123:8848

```
需要配置APISIX-KEY




```
docker build -t nacos-admin:latest .
docker run -d --name nacos-admin --net my-net nacos-admin:latest
docker run --rm -it --net my-net nacos-admin:latest /bin/sh

```