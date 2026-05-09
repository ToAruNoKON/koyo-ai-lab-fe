import { eventHandler } from "h3";
import { createProxyEventHandler } from "h3-proxy";

export default eventHandler(
  createProxyEventHandler({
    target: process.env.BACKEND_URL || "http://localhost:4000",
    pathFilter: ["/api/proxy/**"],
    pathRewrite: {
      "^/api/proxy": "",
    },
    changeOrigin: true,
    enableLogger: false,
  }),
);
