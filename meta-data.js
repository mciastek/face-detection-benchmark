const siteUrl = process.env.WEBSITE_BASE_URL

module.exports = {
  SITE_URL: process.env.WEBSITE_BASE_URL,
  TITLE: 'Face Detection Benchmark',
  OG_COVER: `${siteUrl}/og-cover.jpg`,
  OG_COVER_TWITTER: `${siteUrl}/og-cover-twitter.jpg`,
  TWITTER_HANDLE: '@swingdevio',
  OG_COVER_ALT: ``,
  KEYWORDS: [
    'face detection',
    'node.js',
    'opencv',
    'tracking.js',
    'Chrome Face Detection',
    'machine learning',
    'tensorflow.js',
    'javascript',
    'meet.js summit'
  ].join(', '),
  DESCRIPTION: ``
}
