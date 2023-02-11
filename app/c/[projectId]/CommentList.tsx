import type { Comment } from '@prisma/client'
import 'server-only'
import { CommentComponent } from './Comment'

export async function CommentList(props: {
  comments: Comment[]
}) {
  return (
    <div>
      {props.comments.map(comment => {
        return (
          <>
            {/* @ts-expect-error Server Component */}
            <CommentComponent comment={comment} />
          </>
        )
      })}
    </div>
  )
}