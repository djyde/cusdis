import React from "react"
import { useMutation, useQuery } from "react-query"
import { getAllProjects } from "../pages/dashboard"
import { UserSession } from "../service"
import NextLink from 'next/link'
import { useRouter } from "next/router"
import { SettingsIcon } from '@chakra-ui/icons'
import { AiOutlineLogout, AiOutlineSetting, AiOutlineFileText, AiOutlineAlert, AiOutlinePlus, AiOutlineComment } from 'react-icons/ai'
import { signout, signOut } from "next-auth/client"
import { Footer } from "./Footer"
import { createProject } from "../pages/getting-start"
import { AppShell, Box, Button, Header, Navbar, NavLink, Stack, Text, Title } from "@mantine/core"

// just for type

export function MainLayout(props: { session: UserSession, id?: "comments" | "settings", children?: any }) {

  const router = useRouter()

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
        <NavLink active={props.id === "comments"} styles={styles} label="Comments" icon={<AiOutlineComment />}>
        </NavLink>
        <NavLink styles={styles} label="Settings" icon={<AiOutlineSetting />}>
        </NavLink>
      </Stack>
    )
  }, [])

  return (
    <>
      <AppShell
        padding={'md'}
        fixed={false}
        navbar={<Navbar width={{
          base: 240
        }}>
          {Menubar}
        </Navbar>}
        header={
          <Header height={48}>
          </Header>
        }
        styles={{
          body: {
            backgroundColor: '#f5f5f5'
          }
        }}
      >
        {props.children}
      </AppShell>
    </>
  )
}
