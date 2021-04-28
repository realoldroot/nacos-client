import log4js, { getLogger } from "log4js";
log4js.configure({
  appenders: {
    file: {
      type: "fileSync",
      filename: "log/file.log",
      maxLogSize: 10485760,
      numBackups: 5,
      compress: true,
      encoding: "utf-8",
      layout: {
        type: "pattern",
        pattern: "[%d{yyyy-MM-dd hh:mm:ss}] [%p] %c - %m",
      },
    },
    console: {
      type: "console",
      encoding: "utf-8",
      layout: {
        type: "colored",
      },
    },
  },
  categories: {
    file: { appenders: ["file"], level: "error" },
    default: { appenders: ["file", "console"], level: "debug" },
  },
});
export default log4js;
