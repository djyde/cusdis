import { Globe } from "lucide-react"
import { ActionPannel } from "../../../components/ui/ActionPanel"
import { Button } from "../../../components/ui/Button"
import { Container } from "../../../components/ui/Container"
import { prisma } from "../../../utils/prisma"
import { LatestCommentList } from "./LatestCommentList"
import { ProjectSettings } from "./ProjectSettings"
import { Toggle } from "./Toggle"
import { WebhookSettingsActions, WebhookSettingsBody } from "./WebhookSettings"

export async function getProjectInfo(projectId: string) {

  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
    select: {
      title: true,
      id: true,
      ownerId: true,
      webhook: true
    }
  })

  // we detected non-existed project on layout
  return project!
}


export default async function Page(props) {

  const project = await getProjectInfo(props.params.projectId)

  const [allCommentCount, approvedCommentCount, unapprovedCommentCount] = await prisma.$transaction([
    prisma.comment.count({
      where: {
        page: {
          projectId: project.id
        }
      }
    }),

    prisma.comment.count({
      where: {
        page: {
          projectId: project.id
        },
        approved: true
      }
    }),

    prisma.comment.count({
      where: {
        page: {
          projectId: project.id
        },
        approved: false
      }
    }),

  ])
  return (
    <div>
      <div className="py-12 bg-gray-50 border-b border-b-slate-100">
        <Container className="flex flex-col">
          <h2 className="font-medium text-xl mb-4">Overview</h2>
          <div className="bg-white shadow-sm rounded border">
            <div className="grid grid-cols-2">
              <div className="text-center border-r">
                <div className="text-5xl font-bold py-12">
                  {allCommentCount}
                </div>
                <div className="text-sm pb-8">
                  All comments
                </div>
              </div>
              <div className="text-center ">
                <div className="text-5xl font-bold py-12">
                  {unapprovedCommentCount}
                </div>
                <div className="text-sm pb-8">
                  Unapproved comments
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="py-12 border-b border-b-slate-100">
        <Container className="">
          <h2 className="mb-4 text-lg font-medium">Notifaction</h2>
          <ActionPannel
            title="Webhook"
            description="Configure a webhook to receive notifications when a new comment is posted."
            actions={<WebhookSettingsActions />}
            body={<WebhookSettingsBody />}
          />
        </Container>
      </div>

      {/* <div className="py-12 border-b border-b-slate-50">
        <Container className="bg-white border border-slate-50 rounded p-4">
          <h2 className="mb-4 text-lg font-medium">Settings</h2>
          <ProjectSettings project={project} />
        </Container>
      </div> */}
      {/* <div>
        <a href={`/c/${props.params.projectId}?slug=__preview`} target="_blank">Preview</a>
      </div> */}

      {/* {pages.map(page => {
        return (
          <div key={page.id}>
            {page.title}
          </div>
        )
      })} */}
    </div>
  )
}