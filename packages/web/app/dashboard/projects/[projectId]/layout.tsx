import classNames from "classnames"
import { notFound, redirect } from "next/navigation"
import { styles } from "../../../components/styles"
import { getSession } from "../../../utils/next-auth.server"
import { prisma } from "../../../utils/prisma"
import { getUserProjects } from "./data"
import { SiteSelectButton } from "./SiteSelectButton"

export default async function Layout(props: {
  children,
  params
}) {
  const projectId = props.params.projectId

  const session = await getSession()

  if (!session) {
    redirect('/api/auth/signin')
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
  })

  if (!project || project.ownerId !== session.uid) {
    notFound()
  }

  const projects = await getUserProjects(session.uid)

  return (
    <div className={classNames(styles.container(), 'sm:pt-12')}>
      <div className="flex justify-between items-center mb-12">
        <div className="flex gap-4 items-center">
          <h1 className="font-bold text-3xl">
            Cusdis
          </h1>
          <SiteSelectButton activeProjectId={project.id} projects={projects} />
        </div>

        <div>
          djyde
        </div>
      </div>
      {props.children}
    </div>
  )
}