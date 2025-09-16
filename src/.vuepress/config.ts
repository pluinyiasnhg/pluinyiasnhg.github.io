import { defineUserConfig } from "vuepress";
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { commentPlugin } from '@vuepress/plugin-comment'
import { feedPlugin } from '@vuepress/plugin-feed'

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "庸碌无常的博客",
  description: "写作与计算机学习",

  theme,

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
      },
    }),

    commentPlugin({
      provider: 'Giscus',
      repo: "pluinyiasnhg/pluinyiasnhg.github.io",
      repoId: "R_kgDOPvRPPg",
      category: "Announcements",
      categoryId: "DIC_kwDOPvRPPs4Cva9W",
    }),

    feedPlugin({
      atom: true,
      rss: true,
      icon: 'https://vip.123pan.cn/1844935313/obsidian/blog-logo.jpg' // 一个小的图标，显示在订阅列表中
    }),

  ],
});
