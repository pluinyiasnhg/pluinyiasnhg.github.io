import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Blog Demo",
  description: "A blog demo for vuepress-theme-hope",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,

  locales: {
  "/": {
    // 设置正在使用的语言
    lang: "zh-CN",
  },
  "/en/": {
    // 设置正在使用的语言
    lang: "en-US",
  },
},
});
