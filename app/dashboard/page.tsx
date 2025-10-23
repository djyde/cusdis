import { redirect } from 'next/navigation'
import { getSession } from '../../utils.server'
import { ProjectService } from '../../service/project.service'

export default async function Dashboard() {
  const session = await getSession(null)

  if (!session) {
    redirect('/api/auth/signin')
  }

  const projectService = new ProjectService(null)

  const defaultProject = await projectService.getFirstProject(session.uid, {
    select: {
      id: true
    }
  })

  if (!defaultProject) {
    redirect('/getting-start')
  } else {
    redirect(`/dashboard/project/${defaultProject.id}`)
  }
}

