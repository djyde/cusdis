'use client'

import { Box, Button, Container, createStyles, Group, Stack, Switch, Text, TextInput, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useParams, useRouter } from "next/navigation"
import React from "react"
import { useMutation } from "@tanstack/react-query"
import { MainLayout } from "../../../../../components/Layout"
import { MainLayoutData } from "../../../../../service/viewData.service"
import { apiClient } from "../../../../../utils.client"
import type { ProjectServerSideProps } from './page'

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

export default function SettingsPageClient(props: {
  session: any,
  project: ProjectServerSideProps,
  mainLayoutData: MainLayoutData
}) {
  const { classes: listClasses } = useListStyle()
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

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

  const enableNotificationMutation = useMutation({
    mutationFn: updateProjectSettings,
    onSuccess: successCallback,
    onError: failCallback
  })
  const enableWebhookMutation = useMutation({
    mutationFn: updateProjectSettings,
    onSuccess: successCallback,
    onError: failCallback
  })
  const updateWebhookUrlMutation = useMutation({
    mutationFn: updateProjectSettings,
    onSuccess: successCallback,
    onError: failCallback
  })
  const webhookInputRef = React.useRef<HTMLInputElement>(null)

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
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
                  projectId,
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
                    projectId,
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
                  }} loading={deleteProjectMutation.isPending} color="red">Delete site</Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </MainLayout >
  )
}

