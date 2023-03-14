import Document, { Html, Head, Main, NextScript } from 'next/document'
import { resolvedConfig } from '../utils.server'

class MyDocument extends Document {

  render() {
    return (
      <Html>
        <Head>
          {resolvedConfig.umami.id && <script async defer data-website-id={resolvedConfig.umami.id} src={resolvedConfig.umami.src}></script>}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument