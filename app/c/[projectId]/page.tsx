import { prisma } from "../../utils/prisma"
import { en } from "../lang/en"
import { CommentList } from "./CommentList"
import { ReplyForm } from "./ReplyForm"

export async function getComments (projectId: string, pageSlug: string, page: number, options?: {
  parentId?: string
}) {
  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      page: {
        projectId: projectId,
        slug: pageSlug,
      },
      parentId: options?.parentId
    },
    select: {
      id: true,
      by_nickname: true,
      content: true,
      page: {
        select: {
          projectId: true
        }
      }
    }
  })
  return comments
}

export default async function Page(props) {
  const slug = props.searchParams.slug
  const projectId = props.params.projectId
  const locale = en

  const comments = await getComments(props.params.projectId, slug, 1)
  console.log(comments)
  return (
    <div className="p-2">
      <ReplyForm locale={locale} projectId={projectId} pageSlug={slug} />
      {/* @ts-expect-error Server Component */}
      <CommentList comments={comments} />
    </div>
  )
}