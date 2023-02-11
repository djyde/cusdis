import type { Comment } from '@prisma/client'
import 'server-only'
import { CommentComponent } from './Comment'

export async function CommentList(props: {
  comments: Comment[],
  locale: any
}) {
  return (
    <div className="flex flex-col gap-2" >
      {props.comments.map(comment => {
        return (
          <div key={comment.id}>
            {/* @ts-expect-error Server Component */}
            <CommentComponent locale={props.locale} comment={comment} />
          </div>
        )
      })}
    </div>
  )
}