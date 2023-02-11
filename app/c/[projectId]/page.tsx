import { prisma } from "../../utils/prisma"
import { en } from "../lang/en"
import { CommentList } from "./CommentList"
import { ReplyForm } from "./ReplyForm"
import { Inter } from '@next/font/google'
import classNames from "classnames"

const inter = Inter({
  subsets: ["latin"],
})


export async function getComments(projectId: string, pageSlug: string, page: number, options?: {
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
  return (
    <div className={classNames('p-48', inter.className)}>
      <div className="mb-12">
        <ReplyForm isEditing locale={locale} projectId={projectId} pageSlug={slug} />
      </div>
      {/* @ts-expect-error Server Component */}
      <CommentList locale={locale} comments={comments} />
    </div>
  )
}