import 'server-only'
import { Comment, Prisma } from "@prisma/client"
import { getComments } from './page'
import { CommentList } from './CommentList'
import { ReplyForm } from './ReplyForm'
import { CommentAction } from './CommentAction'
import classNames from 'classnames'
import { env } from '../../env'

export async function CommentComponent(props: {
  locale: any,
  session?: any,
  isChild?: boolean
  comment: Awaited<ReturnType<typeof getComments>>[0]
}) {
  const isSelfhost = !env.isHosted
  // get child comments
  const comments = await getComments(props.comment.page.projectId, props.comment.page.slug, 1, {
    parentId: props.comment.id
  })
  const isModerator = props.comment.moderator?.id === props.comment.page.project.ownerId

  return (
    <div className={classNames('flex flex-col gap-4 pt-2 border-b-gray-100', {
    })}>
      <div className='flex flex-col gap-1'>
        <div className='flex gap-2 items-center'>
          <div className='font-medium dark:text-white'>
            {props.comment.moderator?.displayName || props.comment.moderator?.name || props.comment.by_nickname}
          </div>
          {isModerator && (
            <span className='uppercase bg-gray-100 dark:bg-gray-700 text-xs font-bold px-2 py-1 rounded-md'>
              MOD
            </span>
          )}
          {!props.comment.approved && (
            <div>
              <span className='bg-yellow-500 text-yellow-50 rounded-md px-2 py-1 text-xs font-bold'>Unapproved</span>
            </div>
          )}
          <div className='text-gray-500 text-sm'>
            2023/12/12 12:12
          </div>
        </div>
      </div>
      <div className='text-gray-500 dark:text-gray-100'>
        {props.comment.content}
      </div>
      {props.session &&
        <div>
          <CommentAction comment={props.comment} />
        </div>}
      <ReplyForm isSelfHost={isSelfhost} session={props.session} parentId={props.comment.id} locale={props.locale} projectId={props.comment.page.projectId} />
      {/* children comments */}
      <div className='pl-8'>
        {/* @ts-expect-error Server Component */}
        <CommentList session={props.session} locale={props.locale} comments={comments} />
      </div>
    </div>
  )
}