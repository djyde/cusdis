import { Box, Button, Center, Container, createStyles, Divider, Grid, Group, List, Stack, Switch, Text, TextInput, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { Project } from "@prisma/client"
import { useRouter } from "next/router"
import React from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import {  MainLayout } from "../../../../components/Layout"
import { ProjectService } from "../../../../service/project.service"
import { MainLayoutData, ViewDataService } from "../../../../service/viewData.service"
import { apiClient } from "../../../../utils.client"
import { getSession, resolvedConfig } from "../../../../utils.server"

const deleteProject = async ({ projectId }) => {
  const res = await apiClient.delete<{
    data: string
  }>(`/project/${projectId}`)
  return res.data.data
}

const updateProjectSettings = async ({ projectId, body }) => {
  const res = await apiClient.put(`/project/${projectId}`, body)
  return res.data
}

const useListStyle = createStyles(theme => ({
  container: {
    border: `1px solid #eee`,
  },
  item: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: theme.spacing.md,
    ':not(:last-child)': {
      borderBottom: '1px solid #eee'
    }
  },
  label: {
    fontWeight: 500 as any,
    fontSize: 14
  }
}))

export type ProjectServerSideProps = Pick<Project, 'ownerId' | 'id' | 'title' | 'token' | 'enableNotification' | 'webhook' | 'enableWebhook'>

export default function Page(props: {
  session: any,
  project: ProjectServerSideProps,
  mainLayoutData: MainLayoutData
}) {
  const { classes: listClasses } = useListStyle()

  const router = useRouter()
  const projectId = router.query.projectId as string

  const successCallback = React.useCallback(() => {
    notifications.show({
      title: 'Saved',
      message: 'Settings saved',
      color: 'green'
    })
  }, [])
  const failCallback = React.useCallback(() => {
    notifications.show({
      title: 'Failed',
      message: 'Something went wrong',
      color: 'red'
    })
  }, [])

  const enableNotificationMutation = useMutation(updateProjectSettings, {
    onSuccess: successCallback,
    onError: failCallback
  })
  const enableWebhookMutation = useMutation(updateProjectSettings, {
    onSuccess: successCallback,
    onError: failCallback
  })
  const updateWebhookUrlMutation = useMutation(updateProjectSettings, {
    onSuccess: successCallback,
    onError: failCallback
  })
  const webhookInputRef = React.useRef<HTMLInputElement>(null)

  const deleteProjectMutation = useMutation(deleteProject, {
    onSuccess() {
      location.href = "/dashboard"
    },
    onError: failCallback 
  })

  const onSaveWebhookUrl = async _ => {
    const value = webhookInputRef.current.value

    const validUrlRegexp = /^https?:/

    if (!validUrlRegexp.exec(value)) {
      notifications.show({
        title: 'Not a valid http/https URL',
        message: 'Please enter a valid http/https URL',
        color: 'red'
      })
      return
    }

    updateWebhookUrlMutation.mutate({
      projectId,
      body: {
        webhookUrl: value
      }
    })
  }

  return (
    <MainLayout id="settings" project={props.project} {...props.mainLayoutData}>
      <Container sx={{
        marginTop: 24
      }}>
        <Title sx={{
          marginBottom: 12
        }} order={3}>Settings</Title> 
        <Stack className={listClasses.container} spacing={0}>
          <Box className={listClasses.item}>
            <Group>
              <Text className={listClasses.label}>
                Email Notification
              </Text>
              <Switch defaultChecked={props.project.enableNotification} onChange={e => {
                enableNotificationMutation.mutate({
                  projectId: router.query.projectId,
                  body: {
                    enableNotification: e.target.checked
                  }
                })
              }} />
            </Group>
          </Box>
          <Box className={listClasses.item}>
            <Stack>
              <Group>
                <Text className={listClasses.label}>
                  Webhook
                </Text>
                <Switch defaultChecked={props.project.enableWebhook} onChange={e => {
                  enableWebhookMutation.mutate({
                    projectId: router.query.projectId,
                    body: {
                      enableWebhook: e.target.checked
                    }
                  })
                }} />
              </Group>
              <Group grow>
                <TextInput defaultValue={props.project.webhook} ref={webhookInputRef} placeholder="https://..." />
                <Box>
                  <Button onClick={onSaveWebhookUrl}>Save</Button>
                </Box>
              </Group>
            </Stack>
          </Box>
          <Box className={listClasses.item}>
            <Stack>
              <Group>
                <Text className={listClasses.label}>
                  Danger zone
                </Text>
              </Group>
              <Box>
                <Stack align={'start'}>
                  <Button onClick={_ => {
                    if (window.confirm("Are you sure you want to delete this site?")) {
                      deleteProjectMutation.mutate({
                        projectId
                      })
                    }
                  }} loading={deleteProjectMutation.isLoading} color="red">Delete site</Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Container>


    </MainLayout >
  )
}
export async function getServerSideProps(ctx) {
  const projectService = new ProjectService(ctx.req)
  const viewDataService = new ViewDataService(ctx.req)

  const session = await getSession(ctx.req)

  if (!session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }
  }

  const project = await projectService.get(ctx.query.projectId) as Project

  if (project.deletedAt) {
    return {
      redirect: {
        destination: '/404',
        permanent: false
      }
    }
  }

  if (session && (project.ownerId !== session.uid)) {
    return {
      redirect: {
        destination: '/forbidden',
        permanent: false
      }
    }
  }

  

  return {
    props: {
      mainLayoutData: await viewDataService.fetchMainLayoutData(),
      project: {
        id: project.id,
        title: project.title,
        ownerId: project.ownerId,
        token: project.token,
        enableNotification: project.enableNotification,
        enableWebhook: project.enableWebhook,
        webhook: project.webhook
      }
    }
  }
}
