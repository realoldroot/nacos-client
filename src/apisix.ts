import axios from "axios";
import log4js from "./log_config";
import { UpstreamNode } from "./module";

const log = log4js.getLogger("apisix");
const route_id = 100;
const axiosClient = axios.create({
  baseURL: process.env.APISIX_ADDRESS ?? "http://172.16.101.123:9080",
  headers: {
    "X-API-KEY": process.env.APISIX_KEY ?? "edd1c9f034335f136f87ad84b625c8f1",
  },
});

log.info("apiSixAddress: ", axiosClient.defaults.baseURL);

export class Apisix {
  create_route() {
    axiosClient
      .put("/apisix/admin/routes/" + route_id, {
        id: route_id,
        uris: ["/a", "/b"],
        methods: ["GET", "POST"],
        hosts: ["a.com", "b.com"],
        name: "route-xxx",
        desc: "hello world",
      })
      .then((resp) => {
        log.debug("apisix create_route() success");
      })
      .catch((err) => {
        log.warn(err);
      });
  }

  update_route(nodes: Array<UpstreamNode>) {
    axiosClient
      .patch("/apisix/admin/routes/" + route_id, { upstream: { nodes } })
      .then((resp) => {
        log.debug("apisix update_route success");
      })
      .catch((err) => {
        log.warn(err);
      });
  }

  get_routes() {
    axiosClient
      .get("/apisix/admin/route/" + route_id)
      .then((resp) => {
        log.debug(resp.data);
      })
      .catch((e) => {
        log.warn(e.message);
        return null;
      });
  }
}

export const apiSixClient = new Apisix();
// create_route("0.0.0.0", 3215);

// update_route([{ host: "1.2.1.1", port: 1111, weight: 1 }]);
