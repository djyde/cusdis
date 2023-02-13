import 'server-only'
import { Comment, Prisma } from "@prisma/client"
import { getComments } from './page'
import { CommentList } from './CommentList'
import { ReplyForm } from './ReplyForm'
import { CommentAction } from './CommentAction'
import classNames from 'classnames'

export async function CommentComponent(props: {
  locale: any,
  session?: any,
  isChild?: boolean
  comment: Awaited<ReturnType<typeof getComments>>[0]
}) {
  // get child comments
  const comments = await getComments(props.comment.page.projectId, props.comment.page.slug, 1, {
    parentId: props.comment.id
  })
  return (
    <div className={classNames('flex flex-col gap-4 py-4 border-b-gray-100', {
    })}>
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
      {props.session &&
        <div>
          <CommentAction comment={props.comment} />
        </div>}
      <ReplyForm session={props.session} parentId={props.comment.id} locale={props.locale} projectId={props.comment.page.projectId} pageSlug={props.comment.page.slug} />
      {/* children comments */}
      <div className='pl-8'>
        {/* @ts-expect-error Server Component */}
        <CommentList session={props.session} locale={props.locale} comments={comments} />
      </div>
    </div>
  )
}