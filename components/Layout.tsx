import React, { useCallback, useState } from "react"
import { useMutation, useQuery } from "react-query"
import { useRouter } from "next/router"
import { AiOutlineLogout, AiOutlineSetting, AiOutlineFileText, AiOutlineAlert, AiOutlinePlus, AiOutlineComment, AiOutlineCode, AiOutlineRight, AiOutlineDown, AiOutlineFile } from 'react-icons/ai'
import { signout, signOut } from "next-auth/client"
import { Anchor, AppShell, Avatar, Badge, Box, Button, Code, Group, Header, Menu, Modal, Navbar, NavLink, ScrollArea, Select, Space, Stack, Switch, Text, TextInput, Title } from "@mantine/core"
import Link from "next/link"
import type { ProjectServerSideProps } from "../pages/dashboard/project/[projectId]/settings"
import { modals } from "@mantine/modals"
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { notifications } from "@mantine/notifications"
import { apiClient } from "../utils.client"
import { useForm } from "react-hook-form"
import { MainLayoutData } from "../service/viewData.service"
import { Head } from "./Head"

// From https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
  if (email === '') {
    return true
  }
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const updateUserSettings = async (params: {
  notificationEmail?: string,
  enableNewCommentNotification?: boolean,
  displayName?: string,
}) => {
  const res = await apiClient.put(`/user`, {
    displayName: params.displayName,
    notificationEmail: params.notificationEmail,
    enableNewCommentNotification: params.enableNewCommentNotification,
  })
  return res.data
}

export function MainLayout(props: {
  children?: any,
  id: 'comments' | 'settings'
  project: ProjectServerSideProps,
} & MainLayoutData) {

  const router = useRouter()
  const clipboard = useClipboard()
  const [isUserPannelOpen, { open: openUserModal, close: closeUserModal }] = useDisclosure(false);

  const userSettingsForm = useForm({
    defaultValues: {
      username: props.userInfo.name,
      displayName: props.userInfo.displayName,
      email: props.userInfo.email,
      notificationEmail: props.userInfo.notificationEmail,
    },
  })

  const updateNewCommentNotification = useMutation(updateUserSettings, {
    onSuccess() {
      notifications.show({
        title: 'Success',
        message: 'User settings updated',
        color: 'green'
      })
    },
    onError() {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red'
      })
    }
  })
  const updateUserSettingsMutation = useMutation(updateUserSettings, {
    onSuccess() {
      notifications.show({
        title: 'Success',
        message: 'User settings updated',
        color: 'green'
      })
    },
    onError() {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red'
      })
    }
  })

  const onClickSaveUserSettings = async () => {
    const data = userSettingsForm.getValues()
    if (!validateEmail(data.notificationEmail)) {
      notifications.show({
        title: 'Invalid email',
        message: 'Please enter a valid email address',
        color: 'red'
      })
      return
    }
    updateUserSettingsMutation.mutate({
      displayName: data.displayName,
      notificationEmail: data.notificationEmail,
    })
  }

  const projectId = router.query.projectId as string

  // should memo
  const ProjectMenu = React.useCallback(() => {
    return <Menu>
      <Menu.Target>
        <Button size='xs' variant={'light'} rightIcon={<AiOutlineDown />}>{props.project.title}</Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Link href="/getting-start" style={{ textDecoration: 'none' }}>
          <Menu.Item icon={<AiOutlinePlus />}>
            New site
          </Menu.Item>
        </Link>
        <Menu.Divider />
        <Menu.Label>
          Sites
        </Menu.Label>
        {props.projects.map(project => {
          return (
            <Menu.Item key={project.id} onClick={_ => {
              location.href = `/dashboard/project/${project.id}`
            }}>
              {project.title}
            </Menu.Item>
          )
        })}
      </Menu.Dropdown>
    </Menu>
  }, [props.project.id])

  const Menubar = React.useMemo(() => {
    const styles = {
      root: {
        borderRadius: 4
      },
      label: {
        fontWeight: 500 as any,
        color: '#343A40'
      },
      icon: {
        color: '#343A40'
      }
    }
    return (
      <Stack>
        <Stack spacing={8} p="sm">
          <Link href={`/dashboard/project/${projectId}`} style={{ textDecoration: 'none' }}>
            <NavLink active={props.id === "comments"} styles={styles} label="Comments" icon={<AiOutlineComment />}>
            </NavLink>
          </Link>
          <Link href={`/dashboard/project/${projectId}/settings`} style={{ textDecoration: 'none' }}>
            <NavLink active={props.id === 'settings'} styles={styles} label="Site settings" icon={<AiOutlineSetting />}>
            </NavLink>
          </Link>
          <NavLink component="a" href="/doc" target={'_blank'} label="Documentation" icon={<AiOutlineFileText />}>
          </NavLink>
        </Stack>

      </Stack>
    )
  }, [])

  const openEmbededCodeModal = React.useCallback(() => {
    const code = `<div id="cusdis_thread"
  data-host="${location.origin}"
  data-app-id="${props.project.id}"
  data-page-id="{{ PAGE_ID }}"
  data-page-url="{{ PAGE_URL }}"
  data-page-title="{{ PAGE_TITLE }}"
></div>
<script async defer src="${location.origin}/js/cusdis.es.js"></script>
`

    modals.openConfirmModal({
      title: "Embeded Code",
      closeOnConfirm: false,
      labels: {
        cancel: 'Cancel',
        confirm: 'Copy'
      },
      onConfirm() {
        clipboard.copy(code)
        notifications.show({
          title: 'Copy',
          message: 'copied'
        })
      },
      children: (
        <Code block>
          {code}
        </Code>
      )
    })
  }, [])

  const badge = React.useMemo(() => {
    if (!props.config.isHosted) {
      return <Badge color="green" size="xs">OSS</Badge>
    }

    return <Badge color="green" size="xs">PRO</Badge>
  }, [])

  const header = React.useMemo(() => {
    return (
      <Group mx="md" sx={{
        height: '100%',
        justifyContent: 'space-between'
      }}>
        <Group>
          <Group>
            <Title order={3} style={{ fontWeight: 'bold' }}>
              <Anchor href="/">
                Cusdis
              </Anchor>
            </Title>
            <ProjectMenu />
          </Group>
          <Group sx={{
            // height: '100%'
          }}>
            <Button leftIcon={<AiOutlineCode />} onClick={openEmbededCodeModal} size="xs" variant={'outline'}>
              Embeded code
            </Button>
          </Group>
        </Group>
        <Group spacing={4}>
          <Button onClick={_ => {
            openUserModal()
          }} size="xs" rightIcon={<AiOutlineRight />} variant='subtle'>{props.session.user.name}</Button>
        </Group>
      </Group>
    )
  }, [])

  return (
    <>
      <Head title={`${props.project.title} - Cusdis`} />
      <AppShell
        fixed={false}
        navbar={<Navbar sx={{
        }} width={{
          base: 240,
        }}>
          {Menubar}
        </Navbar>}
        header={
          <Header height={48}>
            {header}
          </Header>
        }
        styles={{
          body: {
            backgroundColor: '#f5f5f5',
          },
          main: {
            overflow: 'scroll'
          }
        }}
      >
        <Modal opened={isUserPannelOpen} onClose={closeUserModal}
          title="User Settings"
        >
          <Stack>
            <Stack spacing={8}>
              <Text weight={500} size="sm">Username</Text>
              <TextInput defaultValue={props.userInfo.name} size="sm" disabled />
            </Stack>
            <Stack spacing={8}>
              <Text weight={500} size="sm">Email (for login)</Text>
              <TextInput defaultValue={props.userInfo.email} size="sm" disabled />
            </Stack>
            <Stack spacing={8}>
              <Text weight={500} size="sm">Email (for notification)</Text>
              <TextInput placeholder={props.userInfo.email} {...userSettingsForm.register("notificationEmail")} size="sm" />
              <Switch defaultChecked={props.userInfo.enableNewCommentNotification} onChange={e => {
                updateNewCommentNotification.mutate({
                  enableNewCommentNotification: e.target.checked
                })
              }} label="Enable notification" />
            </Stack>
            <Stack spacing={8}>
              <Text weight={500} size="sm">Display name</Text>
              <TextInput placeholder={props.userInfo.name} {...userSettingsForm.register("displayName")} size="sm" />
            </Stack>
            {/* <Stack spacing={8}>
              <Text weight={500} size="sm">Subscription </Text>
              <Text size="sm">Current plan: {badge}</Text>
              <Anchor size="sm">Manage subscription</Anchor>
            </Stack> */}
            <Button loading={updateUserSettingsMutation.isLoading} onClick={onClickSaveUserSettings}>Save</Button>
            <Button onClick={_ => signOut()} variant={'outline'} color='red'>
              Logout
            </Button>
          </Stack>
        </Modal>
        {props.children}
      </AppShell>
    </>
  )
}
