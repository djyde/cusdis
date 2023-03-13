import 'server-only'
import { CommentComponent } from './Comment'
import type { getComments } from './data'

export async function CommentList(props: {
  comments: Awaited<ReturnType<typeof getComments>>,
  locale: any,
  session?: any
}) {
  return (
    <div className="flex flex-col" >
      {props.comments.map(comment => {
        return (
          <div key={comment.id}>
            {/* @ts-expect-error Server Component */}
            <CommentComponent session={props.session} locale={props.locale} comment={comment} />
          </div>
        )
      })}
    </div>
  )
}