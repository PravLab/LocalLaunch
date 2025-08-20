/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://locallaunch.in',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/admin', '/api/*'],
  outDir: 'public', // ✅ required
  sourceDir: '.next', // ✅ important for app router builds
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}
