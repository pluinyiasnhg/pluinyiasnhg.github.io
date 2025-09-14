import { defineUserConfig } from "vuepress";
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { commentPlugin } from '@vuepress/plugin-comment'

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "庸碌无常的博客",
  description: "写作与计算机学习",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,

  // locales: {
    // "/": {
    //   // 默认中文界面
    //   lang: "zh-CN",
    //   title: "庸碌无常的博客",
    //   description: "写作与计算机学习"
    // },
    // "/en/": {
    //   // 添加英文，但没配置完成
    //   lang: "en-US",
    //   title: "pluinyiasnhg's blog",
    //   description: "Writing and computer learning"
    // },
  // }

  plugins: [
    docsearchPlugin({
      appId: 'YG7YN3OUQB',
      apiKey: '045033bf4ec35547d1020b6e45996b95',
      indexName: 'Documentation Website',
      locales: {
        '/': {
          placeholder: '搜索文档',
          translations: {
            button: {
              buttonText: '搜索文档',
            },
          },
        },
        // '/en/': {
        //   placeholder: 'Search Documentation',
        //   translations: {
        //     button: {
        //       buttonText: 'Search Documentation',
        //     },
        //   },
        // },
      },
    }),

    commentPlugin({
      provider: 'Giscus',
      repo: "pluinyiasnhg/Giscus-for-vuepress",
      repoid: "R_kgDOPvhPBw",
      category: "Announcements",
      categoryid: "DIC_kwDOPvhPB84Cva7e",
    })
  ],
});
