import axios from "axios";
import log4js from "./log_config";
import { UpstreamNode, Service } from "./module";

const log = log4js.getLogger("apisix");
const axiosClient = axios.create({
  baseURL: process.env.APISIX_ADDRESS ?? "http://172.16.101.123:9080",
  headers: {
    "X-API-KEY": process.env.APISIX_KEY ?? "edd1c9f034335f136f87ad84b625c8f1",
  },
});

log.info("apiSixAddress: ", axiosClient.defaults.baseURL);

export class Apisix {
  async initRoute(s: Service) {
    try {
      await axiosClient.get("/apisix/admin/routes/" + s.routeId);
    } catch (e) {
      log.warn("initRoute error: ", e);
      await this.createRoute(s);
      return true;
    }
  }

  async createRoute(s: Service) {
    try {
      await axiosClient.put("/apisix/admin/routes/" + s.routeId, s.routeData);
      log.info("apisix createRoute() success: ", s.name);
    } catch (e) {
      log.warn("createRoute error: ", e);
    }
  }

  async updateRoute(s: Service, nodes: Array<UpstreamNode>) {
    try {
      await axiosClient.patch("/apisix/admin/routes/" + s.routeId, {
        upstream: { nodes },
      });
      log.info("apisix updateRoute() success: ", s.name);
    } catch (e) {
      log.warn("updateRoute error: ", e);
    }
  }

  async offline(s: Service) {
    try {
      await axiosClient.patch("/apisix/admin/routes/" + s.routeId, {
        status: 0,
      });
    } catch (e) {
      log.warn(e.message);
    }
  }

  async online(s: Service) {
    try {
      await axiosClient.patch("/apisix/admin/routes/" + s.routeId, {
        status: 1,
      });
    } catch (e) {
      log.warn(e.message);
    }
  }
}

export const apiSixClient = new Apisix();

// apiSixClient.initRoute();
// apiSixClient.createRoute();
// apiSixClient.online();
// apiSixClient.updateRoute([{host:"1.1.1.1",port:1234,weight:1},{host:"2.2.2.2",port:1234,weight:1}]);
