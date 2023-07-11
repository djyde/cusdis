import React from "react"
import { useMutation, useQuery } from "react-query"
import { getAllProjects } from "../pages/dashboard"
import { UserSession } from "../service"
import NextLink from 'next/link'
import { useRouter } from "next/router"
import { SettingsIcon } from '@chakra-ui/icons'
import { AiOutlineLogout, AiOutlineSetting, AiOutlineFileText, AiOutlineAlert, AiOutlinePlus, AiOutlineComment, AiOutlineCode } from 'react-icons/ai'
import { signout, signOut } from "next-auth/client"
import { Footer } from "./Footer"
import { createProject } from "../pages/getting-start"
import { AppShell, Box, Button, Code, Group, Header, Navbar, NavLink, ScrollArea, Stack, Text, Title } from "@mantine/core"
import Link from "next/link"
import type { ProjectServerSideProps } from "../pages/dashboard/project/[projectId]/settings"
import { modals } from "@mantine/modals"
import { useClipboard } from '@mantine/hooks';
import { notifications } from "@mantine/notifications"

// just for type

export function MainLayout(props: { session: UserSession, id?: "comments" | "settings", project: ProjectServerSideProps, children?: any }) {

  const router = useRouter()
  const clipboard = useClipboard()

  const createProjectMutation = useMutation(createProject)
  const titleInputRef = React.useRef<HTMLInputElement>(null)

  const projectId = router.query.projectId as string

  const getProjects = useQuery("getProjects", getAllProjects, {
    enabled: !!props.session,
  })

  async function onClickCreateProject() {
    if (!titleInputRef.current.value) {
      return
    }

    await createProjectMutation.mutate(
      {
        title: titleInputRef.current.value,
      },
      {
        onSuccess(data) {
          location.href = `/dashboard/project/${data.data.id}`
        },
      }
    )
  }

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
      <Stack spacing={8} p="sm">
        <Link href={`/dashboard/project/${projectId}`} style={{ textDecoration: 'none' }}>
          <NavLink active={props.id === "comments"} styles={styles} label="Comments" icon={<AiOutlineComment />}>
          </NavLink>
        </Link>
        <Link href={`/dashboard/project/${projectId}/settings`} style={{ textDecoration: 'none' }}>
          <NavLink active={props.id === 'settings'} styles={styles} label="Settings" icon={<AiOutlineSetting />}>
          </NavLink>
        </Link>
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

  const header = React.useMemo(() => {
    return (
      <Group mx="md" sx={{
        height: '100%'
      }}>
        <Group>
          <Title order={3} style={{ fontWeight: 'bold' }}>
            Cusdis
          </Title>
        </Group>
        <Group sx={{
          // height: '100%'
        }}>
          <Button leftIcon={<AiOutlineCode />} onClick={openEmbededCodeModal} size="xs" variant={'outline'}>
            Embeded code
          </Button>
        </Group>
      </Group>
    )
  }, [])

  return (
    <>
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
        {props.children}
      </AppShell>
    </>
  )
}
