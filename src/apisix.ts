import axios from "axios";
import log4js from "./log_config";
import { UpstreamNode, EServiceName } from "./module";

const log = log4js.getLogger("apisix");
const routeId = 100;
const axiosClient = axios.create({
  baseURL: process.env.APISIX_ADDRESS ?? "http://172.16.101.123:9080",
  headers: {
    "X-API-KEY": process.env.APISIX_KEY ?? "edd1c9f034335f136f87ad84b625c8f1",
  },
});

log.info("apiSixAddress: ", axiosClient.defaults.baseURL);

export class Apisix {
  async initRoute() {
    try {
      let resp = await axiosClient.get("/apisix/admin/routes/" + 101);
    } catch (e) {
      log.warn(e.message);
      this.createRoute();
    }
  }

  async createRoute() {
    try {
      await axiosClient.put("/apisix/admin/routes/" + routeId, {
        id: routeId,
        uris: ["/a", "/b"],
        methods: ["GET", "POST"],
        hosts: ["a.com", "b.com"],
        name: "route-xxx",
        desc: "hello world",
        upstream: {
          type: "roundrobin",
          nodes: [],
        },
      });
      log.debug("apisix createRoute() success");
    } catch (e) {
      log.warn(e);
    }
  }

  async updateRoute(nodes: Array<UpstreamNode>) {
    try {
      await axiosClient.patch("/apisix/admin/routes/" + routeId, {
        upstream: { nodes },
      });
      log.debug("apisix updateRoute() success");
    } catch (e) {
      log.warn(e.message);
    }
  }

  async offline() {
    try {
      await axiosClient.patch("/apisix/admin/routes/" + routeId, { status: 0 });
    } catch (e) {
      log.warn(e.message);
    }
  }

  async online() {
    try {
      await axiosClient.patch("/apisix/admin/routes/" + routeId, { status: 1 });
    } catch (e) {
      log.warn(e.message);
    }
  }
}

export const apiSixClient = new Apisix();

apiSixClient.initRoute();
// apiSixClient.createRoute();
// apiSixClient.online();
// apiSixClient.updateRoute([{host:"1.1.1.1",port:1234,weight:1},{host:"2.2.2.2",port:1234,weight:1}]);
