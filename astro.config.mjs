// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import react from '@astrojs/react';

import remarkMath from 'remark-math';

import rehypeKatex from 'rehype-katex';



export default defineConfig({
  // 1. 你的 GitHub 主域名（或者你自己的域名）
  site: 'https://n0v5.github.io',
  // 2. 将子路径设为 /posts/
  base: '/posts/',
  
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    react()
  ],
  markdown: {
    // Astro 默认自带极其精美的 Shiki 代码高亮，你可以选择主题
    shikiConfig: {
      theme: 'github-dark',
    }
  }
});
// https://astro.build/config
// export default defineConfig({
//   vite: {
//     plugins: [tailwindcss()]
//   },

//   integrations: [mdx(), react()]
// });