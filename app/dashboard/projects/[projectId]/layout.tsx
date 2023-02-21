import { Globe } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getSession } from "../../../utils/next-auth";
import { prisma } from "../../../utils/prisma";
import Navbar from "./Navbar";
import { Toggle } from "./Toggle";

export default async function Layout(props) {
  const projectId: string = props.params.projectId

  const session = await getSession()
  if (!session) {
    // TODO: redirect to sign in page
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
    select: {
      title: true,
      id: true,
      ownerId: true
    }
  })

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
          <Globe className="w-4 h-4" />
          <h2 className="font-bold">{project.title}</h2>
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