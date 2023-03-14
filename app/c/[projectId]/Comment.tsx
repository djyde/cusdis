import 'server-only'
import { CommentList } from './CommentList'
import { ReplyForm } from './ReplyForm'
import { CommentAction } from './CommentAction'
import classNames from 'classnames'
import { env } from '../../env'
import { getComments } from './data'

export async function CommentComponent(props: {
  locale: any,
  session?: any,
  isChild?: boolean
  isModerator: boolean
  timezoneOffset: number,
  comment: Awaited<ReturnType<typeof getComments>>[0]
}) {
  const isSelfhost = !env.isHosted
  // get child comments
  const comments = await getComments(props.comment.page.projectId, props.comment.page.slug, 1, props.timezoneOffset, {
    parentId: props.comment.id,
    onlyApproved: !props.isModerator,
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
            {/* @ts-expect-error */}
            {props.comment.createdAt as string}
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