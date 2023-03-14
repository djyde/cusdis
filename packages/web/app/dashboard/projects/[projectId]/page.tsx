import { getSession } from "../../../utils/next-auth.server"
import { prisma } from "../../../utils/prisma"
import { CommentList } from "./CommentList"

function EmbededCode(props: {
  projectId: string,
  host: string
}) {
  return (
    <code>
      {`<div id="cusdis_thread"
  data-host="${props.host}"
  data-app-id="${props.projectId}"
  data-page-id="{{ PAGE_ID }}"
  data-page-url="{{ PAGE_URL }}"
  data-page-title="{{ PAGE_TITLE }}"
></div>
<script async defer src="${props.host}/js/cusdis.es.js"></script>
`}
    </code>
  )
}


export default async function Page(props) {
  const projectId = props.params.projectId

  // had been guarded
  const session = await getSession()


  return (
    <div>
      <CommentList projectId={projectId} />
    </div>
  )
}