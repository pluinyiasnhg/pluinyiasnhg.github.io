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
    // 默认中文界面
    lang: "zh-CN",
    title: "庸碌无常的博客",
    description: "写作与计算机学习"
  },
  "/en/": {
    // 添加英文，但没配置完成
    lang: "en-US",
    title: "pluinyiasnhg's blog",
    description: "Writing and computer learning"
  },
},
});
