import { redirect } from 'next/navigation'
import { Project } from '@prisma/client'
import { ProjectService } from '../../../../service/project.service'
import { getSession } from '../../../../utils.server'
import { ViewDataService } from '../../../../service/viewData.service'
import ProjectPageClient from './page-client'

type ProjectServerSideProps = Pick<Project, 'ownerId' | 'id' | 'title' | 'token' | 'enableNotification' | 'webhook' | 'enableWebhook'>

export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  const projectService = new ProjectService(null)
  const session = await getSession(null)
  const project = await projectService.get(params.projectId) as Project
  const viewDataService = new ViewDataService(null)

  if (!session) {
    redirect('/dashboard')
  }

  if (project.deletedAt) {
    redirect('/404')
  }

  if (session && (project.ownerId !== session.uid)) {
    redirect('/forbidden')
  }

  const mainLayoutData = await viewDataService.fetchMainLayoutData()

  const projectProps: ProjectServerSideProps = {
    id: project.id,
    title: project.title,
    ownerId: project.ownerId,
    token: project.token,
    enableNotification: project.enableNotification,
    enableWebhook: project.enableWebhook,
    webhook: project.webhook
  }

  return <ProjectPageClient project={projectProps} session={session} mainLayoutData={mainLayoutData} />
}

