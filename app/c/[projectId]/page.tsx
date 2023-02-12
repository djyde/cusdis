import { prisma } from "../../utils/prisma"
import { en } from "../lang/en"
import { CommentList } from "./CommentList"
import { ReplyForm } from "./ReplyForm"
import { Inter } from '@next/font/google'
import classNames from "classnames"
import { getSession } from "../../utils/next-auth"

const inter = Inter({
  subsets: ["latin"],
})


export async function getComments(projectId: string, pageSlug: string, page: number, options?: {
  parentId?: string,
  onlyApproved?: boolean
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
      approved: options?.onlyApproved ? true : undefined,
      parentId: options?.parentId
    },
    select: {
      id: true,
      by_nickname: true,
      content: true,
      page: {
        select: {
          slug: true,
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
  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
    select: {
      ownerId: true
    }
  })

  const session = await getSession()
  const isModerate = project.ownerId === session?.uid
  const comments = await getComments(props.params.projectId, slug, 1, {
    onlyApproved: !isModerate,
    parentId: null
  })
  return (
    <div className={classNames('p-48', inter.className)}>
      <div className="mb-12">
        <ReplyForm session={session} locale={locale} projectId={projectId} pageSlug={slug} />
      </div>
      {/* @ts-expect-error Server Component */}
      <CommentList session={session} locale={locale} comments={comments} />
    </div>
  )
}