import 'server-only'
import { Comment, Prisma } from "@prisma/client"
import { getComments } from './page'
import { CommentList } from './CommentList'

export async function CommentComponent(props: {
  comment: Prisma.CommentGetPayload<{
    select: {
      id: true,
      by_nickname: true,
      content: true,
      page: {
        select: {
          id: true,
          slug: true,
          projectId: true
        }
      }
    }
  }>
}) {
  // get child comments
  const comments = await getComments(props.comment.page.projectId, props.comment.page.slug, 1, {
    parentId: props.comment.id
  })
  return (
    <div>
      <div>
        {props.comment.by_nickname}
      </div>
      <div>
        {props.comment.content}
      </div>
      {/* children comments */}
      {/* @ts-expect-error Server Component */}
      <CommentList comments={comments} />
    </div>
  )
}