import { prisma } from "../../utils/prisma"
import { en } from "../lang/en"
import { CommentList } from "./CommentList"
import { ReplyForm } from "./ReplyForm"
import { Inter } from '@next/font/google'
import classNames from "classnames"
import { getSession } from "../../utils/next-auth"
import { Bridge } from "./Bridge"
import { env } from "../../env"
import { getComments } from "./data"

const inter = Inter({
  subsets: ["latin"],
})


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

  if (!project) {
    // TODO: 404
    return null
  }

  const session = await getSession()
  const isModerate = project.ownerId === session?.uid
  const comments = await getComments(props.params.projectId, pageId, 1, {
    onlyApproved: !isModerate,
    parentId: undefined
  })
  const isSelfHost = !env.isHosted
  return (
    <>
      <Bridge />
      <div className={classNames(inter.className, 'dark:bg-black dark:text-gray-100')}>
        <div className="mb-2">
          <ReplyForm isSelfHost={isSelfHost} variant="expanded" session={session} locale={locale} projectId={projectId} />
        </div>
        {/* @ts-expect-error Server Component */}
        <CommentList session={session} locale={locale} comments={comments} />
      </div>

    </>
  )
}