import { prisma } from "../../utils/prisma"
import { en } from "../lang/en"
import { CommentList } from "./CommentList"
import { ReplyForm } from "./ReplyForm"
import { Inter } from '@next/font/google'
import classNames from "classnames"
import { getSession } from "../../utils/next-auth"
import Script from "next/script"
import { Bridge } from "./Bridge"

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
      deletedAt: null,
      approved: options?.onlyApproved ? true : undefined,
      parentId: options?.parentId
    },
    select: {
      id: true,
      by_nickname: true,
      moderator: {
        select: {
          displayName: true,
          name: true,
          id: true,
        }
      },
      content: true,
      approved: true,
      page: {
        select: {
          slug: true,
          projectId: true,
          project: {
            select: {
              ownerId: true
            }
          }
        }
      }
    }
  })
  return comments
}

export default async function Page(props) {
  const pageUrl = props.searchParams['p_u']
  const pageId = props.searchParams['p_id'] || pageUrl
  const pageTitle = props.searchParams['p_t']
  const projectId = props.params['projectId']
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
  const comments = await getComments(props.params.projectId, pageId, 1, {
    onlyApproved: !isModerate,
    parentId: null
  })
  return (
    <>
      <Bridge />
      <div className={classNames(inter.className)}>
        <div className="mb-2">
          <ReplyForm variant="expanded" session={session} locale={locale} projectId={projectId} pageSlug={pageId} />
        </div>
        {/* @ts-expect-error Server Component */}
        <CommentList session={session} locale={locale} comments={comments} />
      </div>

    </>
  )
}