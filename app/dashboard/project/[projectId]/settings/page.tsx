import { redirect } from 'next/navigation'
import { Project } from '@prisma/client'
import { ProjectService } from '../../../../../service/project.service'
import { ViewDataService } from '../../../../../service/viewData.service'
import { getSession } from '../../../../../utils.server'
import SettingsPageClient from './page-client'

export type ProjectServerSideProps = Pick<Project, 'ownerId' | 'id' | 'title' | 'token' | 'enableNotification' | 'webhook' | 'enableWebhook'>

export default async function SettingsPage({ params }: { params: { projectId: string } }) {
  const projectService = new ProjectService(null)
  const viewDataService = new ViewDataService(null)

  const session = await getSession(null)

  if (!session) {
    redirect('/dashboard')
  }

  const project = await projectService.get(params.projectId) as Project

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

  return <SettingsPageClient session={session} project={projectProps} mainLayoutData={mainLayoutData} />
}

