import { nacosClient } from "./nacos";
import { apiSixClient } from "./apisix";

apiSixClient.initRoute();
nacosClient.subscribe();
