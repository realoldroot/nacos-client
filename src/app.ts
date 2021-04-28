import { nacosClient } from "./nacos";
import { apiSixClient } from "./apisix";
import { ms, rs } from "./module";
import log4js from "log4js";

const log = log4js.getLogger("app");

async function main() {
  await apiSixClient.initRoute(ms);
  await apiSixClient.initRoute(rs);

  nacosClient.subscribe(ms);
  nacosClient.subscribe(rs);
}

main().catch((err) => log.error(err.message));
