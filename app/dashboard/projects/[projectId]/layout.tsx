import { Globe } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { env } from "../../../env";
import { getSession } from "../../../utils/next-auth";
import { prisma } from "../../../utils/prisma";
import { EmbededCode } from "./EmbededCode";
import { Toggle } from "./Toggle";
import { WebsiteTitleEditIcon } from "./WebsiteEditIcon";

export default async function Layout(props) {
  const projectId: string = props.params.projectId

  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
    select: {
      id: true,
      ownerId: true,
      title: true
    }
  })

  const session = await getSession()
  if (!session) {
    // TODO: redirect to sign in page
    redirect("/api/auth/signin")
    return
  }
  if (!project) {
    notFound()
    // TODO: 404
  }

  if (project.ownerId !== session.uid) {
    redirect('/')
    // TODO: 403
  }

  return (
    <div>
      <div className="border-b border-b-slate-100 p-4 grid grid-cols-3">
        <div className="flex gap-2 items-center">
          <WebsiteTitleEditIcon projectId={project.id} />
          <h2 className="font-bold">{project.title}</h2>
          <div>
            <EmbededCode projectId={project.id} host={env.host} />
          </div>
        </div>

        <div className="place-self-center">
          <Toggle projectId={project.id} />
        </div>
        <div>
        </div>
      </div>

      <div>
        {props.children}
      </div>
    </div>
  )
}