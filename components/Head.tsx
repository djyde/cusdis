import * as React from 'react'
import NextHead from 'next/head'

export function Head(props: {
  title: string
}) {
  return (
    <>
      <NextHead>
        <meta name="title" content="Cusdis - Lightweight, privacy-first, open-source comment system" />
        <meta name="description" content="Cusdis is an open-source, lightweight (~5kb gzipped), privacy-first alternative to Disqus. It's super easy to use and integrate with your existed website" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cusdis.com/" />
        <meta property="og:title" content="Cusdis - Lightweight, privacy-first, open-source comment system" />
        <meta property="og:description" content="Cusdis is an open-source, lightweight (~5kb gzipped), privacy-first alternative to Disqus. It's super easy to use and integrate with your existed website" />
        <meta property="og:image" content="https://cusdis.com/images/og.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://cusdis.com/" />
        <meta property="twitter:title" content="Cusdis - Lightweight, privacy-first, open-source comment system" />
        <meta property="twitter:description" content="Cusdis is an open-source, lightweight (~5kb gzipped), privacy-first alternative to Disqus. It's super easy to use and integrate with your existed website" />
        <meta property="twitter:image" content="https://cusdis.com/images/og.png" />

        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicons/apple-touch-icon.png?v=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicons/favicon-32x32.png?v=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicons/favicon-16x16.png?v=1" />
        <link rel="manifest" href="/images/favicons/site.webmanifest?v=1" />
        <link rel="mask-icon" href="/images/favicons/safari-pinned-tab.svg?v=1" color="#2c7da0" />
        <link rel="shortcut icon" href="/images/favicons/favicon.ico?v=1" />
        <meta name="msapplication-TileColor" content="#2c7da0" />
        <meta name="msapplication-config" content="/images/favicons/browserconfig.xml?v=1" />
        <meta name="theme-color" content="#ffffff" />

        <title>
          {props.title}
        </title>
      </NextHead>
    </>
  )
}