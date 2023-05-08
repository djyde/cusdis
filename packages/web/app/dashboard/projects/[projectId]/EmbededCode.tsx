'use client'

import { usePathname } from "next/navigation"
import React, { useEffect } from "react"

export function EmbededCode(props: {
  projectId: string,
}) {
  const [url, setUrl] = React.useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(location.origin)
    }
  }, [])

  return (
    <pre className="overflow-scroll bg-gray-100 p-4 rounded shadow-inner">
      <code>
        {`<div id="cusdis_thread"
  data-host="${url}"
  data-app-id="${props.projectId}"
  data-page-id="{{ PAGE_ID }}"
  data-page-url="{{ PAGE_URL }}"
  data-page-title="{{ PAGE_TITLE }}"
></div>
<script async defer src="${url}/js/cusdis.es.js"></script>
`}
      </code>
    </pre>
  )
}
