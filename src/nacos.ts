import { apiSixClient } from "./apisix";
import log4js from "./log_config";
import * as nacos from "nacos";
const { NacosNamingClient } = nacos as any;
import { NacosInstance, UpstreamNode, Service } from "./module";
import axios from "axios";

const log = log4js.getLogger("nacos");
let lastNodeCount = 0;

const nacosAddress = process.env.NACOS_ADDRESS ?? "172.16.101.123:8848";
const namespace = process.env.PROFILE ?? "dev";
log.info("nacosAddress: ", nacosAddress);

const _log = {
  debug(data: any) {},
  info(data: any) {},
  warn(data: any) {},
};

let rsArr: Array<NacosInstance>;

const client = new NacosNamingClient({
  logger: _log,
  serverList: nacosAddress,
  namespace: namespace,
});

function subscribe(s: Service) {
  client.subscribe(s.name, async (data: Array<NacosInstance>) => {
    if (data.length == 0 && lastNodeCount == 0) {
      return;
    }
    lastNodeCount = data.length;
    let nodes = Array<UpstreamNode>(data.length);
    data.forEach(function (item, idx) {
      nodes[idx] = {
        host: item.ip,
        port: item.port,
        weight: item.weight,
      };
    });
    log.info("instance changed: ", nodes);
    await apiSixClient.updateRoute(s, nodes);

    if (s.name === "rs") {
      if (rsArr !== undefined) {
        updateAliveRs(data);
      } else {
        rsArr = data;
      }
    }
  });
}

export const nacosClient = {
  subscribe,
};

/**
 * 筛选出来离线的rs，然后关闭房间
 * @param aliveRs 存活的rs
 */
function updateAliveRs(aliveRs: Array<NacosInstance>) {
  const offlineRs = Array<NacosInstance>();
  for (const rs of rsArr) {
    if (aliveRs.find((x) => x.instanceId === rs.instanceId) === undefined) {
      offlineRs.push(rs);
    }
  }
  rsArr = aliveRs;
  notifyOfflineRs(offlineRs);
}

const baseURL = process.env.APISIX_ADDRESS ?? "http://172.16.101.123:9080";

async function notifyOfflineRs(rs: Array<NacosInstance>) {
  if (rs.length === 0) {
    return;
  }
  log.info("rs离线，请求关闭房间", rs);
  const resp = await axios.post(
    baseURL + "/internal/ms/rsOffline",
    rs.map((x) => x.metadata.serverName),
    { timeout: 6000 }
  );
  log.info("offlineRes resp:", resp.status);
}
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
