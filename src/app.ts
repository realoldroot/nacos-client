import { nacosClient } from "./nacos";
import { apiSixClient } from "./apisix";

apiSixClient.create_route();
nacosClient.subscribe();
