import { apiSixClient } from "./apisix";
import log4js from "./log_config";
import * as nacos from "nacos";
const { NacosNamingClient } = nacos as any;
import { NacosInstance, UpstreamNode, Service } from "./module";

const log = log4js.getLogger("nacos");
let lastNodeCount = 0;

const nacosAddress = process.env.NACOS_ADDRESS ?? "172.16.101.123:8848";
log.info("nacosAddress: ", nacosAddress);

const client = new NacosNamingClient({
  logger: log,
  serverList: nacosAddress,
  namespace: "public",
});

function subscribe(s: Service) {
  client.subscribe(s.name, async (data: Array<NacosInstance>) => {
    if (data.length == 0 && lastNodeCount == 0) {
      return;
    }
    lastNodeCount = data.length;
    let nodes = Array<UpstreamNode>(data.length);
    data.forEach(function (item, idx) {
      nodes[idx] = { host: item.ip, port: item.port, weight: 1 };
    });
    log.info("instance changed: ", nodes);
    await apiSixClient.updateRoute(s, nodes);
  });
}

export const nacosClient = {
  subscribe,
};

// [
//     {
//       instanceId: '1.1.1.1#8080#DEFAULT#DEFAULT_GROUP@@rs',
//       ip: '1.1.1.1',
//       port: 8080,
//       weight: 1,
//       healthy: true,
//       enabled: true,
//       ephemeral: true,
//       clusterName: 'DEFAULT',
//       serviceName: 'DEFAULT_GROUP@@rs',
//       metadata: {},
//       ipDeleteTimeout: 30000,
//       instanceIdGenerator: 'simple',
//       instanceHeartBeatTimeOut: 15000,
//       instanceHeartBeatInterval: 5000
//     },
//     {
//       instanceId: '2.2.2.2#8080#DEFAULT#DEFAULT_GROUP@@rs',
//       ip: '2.2.2.2',
//       port: 8080,
//       weight: 1,
//       healthy: true,
//       enabled: true,
//       ephemeral: true,
//       clusterName: 'DEFAULT',
//       serviceName: 'DEFAULT_GROUP@@rs',
//       metadata: {},
//       ipDeleteTimeout: 30000,
//       instanceIdGenerator: 'simple',
//       instanceHeartBeatTimeOut: 15000,
//       instanceHeartBeatInterval: 5000
//     }
//   ]
