module.exports = {
  base: '/PracticeForThirtyDay/', // 设置站点根路径
  dest: './dist',    // 设置输出目录
  title: '学习积累',
  description: '30道前端面试练习题',
  // repo: `https://github.com/Bimbaloo/PracticeForThirtyDay.git`, // 添加 github 链接
  themeConfig: {
    repo: 'Bimbaloo/PracticeForThirtyDay',
    // 添加导航栏
    nav: [
      { text: '首页', link: '/home/' },
      { text: 'Blog', link: '/blog/' },
      { text: '知乎', link: '/zhihu/' },
      {
        text: '我的项目',
        // 下拉的展示
        items: [
          { text: 'focus-outside', link: 'https://github.com/TaoXuSheng/focus-outside' },
          { text: 'stylus-converter', link: 'https://github.com/TaoXuSheng/stylus-converter' },
        ]
      }
    ],
    // 为以下路由添加侧边栏
    sidebar: {
      '/home/': [
        'git',
        'vue-amap',
        'js-function'
      ],
      '/blog/': [
        'webpack',
        'array',
        'Performance',
        'vue-amap',
        'js-function'
      ],
      '/zhihu/': [
        'vuepress',
        'vue-business-component'
      ]
    }
  }
}