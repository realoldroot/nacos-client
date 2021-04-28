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
