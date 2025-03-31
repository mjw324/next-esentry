import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard',
    },
    sitemap: 'https://www.esentry.dev/sitemap.xml',
    host: 'https://www.esentry.dev',
  }
}