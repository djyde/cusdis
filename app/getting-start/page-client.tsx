'use client'

import { Box, Container, Stack, Title, Text, Button, TextInput, Image } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useRouter } from "next/navigation"
import React from "react"
import { useMutation } from "@tanstack/react-query"
import { Head } from "../../components/Head"
import { apiClient } from "../../utils.client"

export const createProject = async (body: { title: string }) => {
  const res = await apiClient.post("/projects", {
    title: body.title,
  })
  return res.data
}

export default function GettingStartClient() {
  const createProjectMutation = useMutation({
    mutationFn: createProject
  })
  const titleInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function onClickCreateProject() {
    if (!titleInputRef.current?.value) {
      return
    }

    await createProjectMutation.mutate(
      {
        title: titleInputRef.current.value,
      },
      {
        onSuccess(data) {
          notifications.show({
            title: "Project created",
            message: "Redirecting to project dashboard",
            color: 'green'
          })
          router.push(`/dashboard/project/${data.data.id}`)
        },
        onError(data: any) {
          const {
            error: message,
            status: statusCode
          } = data.response.data

          notifications.show({
            title: "Error",
            message,
            color: 'yellow'
          })
        }
      }
    )
  }

  return (
    <>
      <Head title="Add new site - Cusdis" />
      <Container mt={120}>

        <Stack>
          <Image width={48} src="/images/artworks/logo-256.png" mb="16">
          </Image>
          <Stack spacing={4}>
            <Title order={2} weight={500}>
              Let's create a new site
            </Title>
            <Text color="gray">
              Give your site a name, and you can start using Cusdis.
            </Text>
          </Stack>

          <Stack spacing={8}>
            <Text>
              Site name
            </Text>
            <TextInput placeholder="My personal blog" ref={titleInputRef} />
          </Stack>

          <Box>
            <Button onClick={_ => void onClickCreateProject()} loading={createProjectMutation.isPending} color="blue">Create</Button>
          </Box>
        </Stack>
      </Container>
    </>
  )
}

