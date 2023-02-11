import 'server-only'
import { Comment, Prisma } from "@prisma/client"
import { getComments } from './page'
import { CommentList } from './CommentList'
import { ReplyForm } from './ReplyForm'

export async function CommentComponent(props: {
  locale: any,

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
    <div className='flex flex-col gap-4 border-b py-4 border-b-gray-100'>
      <div className='flex flex-col gap-1'>
        <div className='font-medium'>
          {props.comment.by_nickname}
        </div>
        <div className='text-gray-500 text-sm'>
          2023/12/12 12:12
        </div>
      </div>
      <div className='text-gray-500'>
        {props.comment.content}
      </div>
      <ReplyForm locale={props.locale} projectId={props.comment.page.projectId} pageSlug={props.comment.page.slug}/>
      {/* children comments */}
      {/* @ts-expect-error Server Component */}
      <CommentList comments={comments} />
    </div>
  )
}