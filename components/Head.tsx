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
        <title>
          {props.title}
        </title>
      </NextHead>
    </>
  )
}