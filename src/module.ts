export interface UpstreamNode {
  host: string;
  port: number;
  weight: number;
}

export interface NacosInstance {
  instanceId: string;
  ip: string;
  port: number;
  weight: number;
  healthy: boolean;
  enabled: boolean;
  ephemeral: boolean;
  clusterName: string;
  serviceName: string;
  metadata: {};
  ipDeleteTimeout: number;
  instanceIdGenerator: string;
  instanceHeartBeatTimeOut: number;
  instanceHeartBeatInterval: number;
}
export interface Service {
  name: string;
  routeId: number;
  routeData: any;
}

const ms: Service = {
  name: "ms",
  routeId: 100,
  routeData: {
    id: 100,
    uris: ["/*"],
    methods: ["GET", "POST"],
    name: "route-app",
    desc: "create by rest api",
    upstream: {
      type: "roundrobin",
      nodes: [],
    },
  },
};

const rs: Service = {
  name: "rs",
  routeId: 200,
  routeData: {
    id: 200,
    uris: ["/internal/rs/*"],
    methods: ["GET", "POST"],
    // hosts: ["a.com", "b.com"],
    name: "route-rs",
    desc: "create by rest api",
    upstream: {
      type: "roundrobin",
      nodes: [],
    },
  },
};

export { ms, rs };
