import 'server-only'
import { CommentComponent } from './Comment'
import type { getComments } from './data'

export async function CommentList(props: {
  comments: Awaited<ReturnType<typeof getComments>>,
  locale: any,
  session?: any,
  isModerator: boolean
  timezoneOffset: number,
}) {
  return (
    <div className="flex flex-col" >
      {props.comments.map(comment => {
        return (
          <div key={comment.id}>
            {/* @ts-expect-error Server Component */}
            <CommentComponent timezoneOffset={props.timezoneOffset} isModerator={props.isModerator}  session={props.session} locale={props.locale} comment={comment} />
          </div>
        )
      })}
    </div>
  )
}