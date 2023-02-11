import { en } from "../lang/en"
import { getComments } from "../service"
import { ReplyForm } from "./ReplyForm"

export default async function Page(props) {
  const slug = props.searchParams.slug
  const projectId = props.params.projectId
  const locale = en
  const comments = await getComments(props.params.projectId, 0)
  console.log(comments)
  return (
    <div className="p-2">
      <ReplyForm locale={locale} projectId={projectId} />
    </div>
  )
}