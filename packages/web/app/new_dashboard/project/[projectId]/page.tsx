import { getSession } from "../../../utils/next-auth.server"
import { prisma } from "../../../utils/prisma"
import { CommentList } from "./CommentList"

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