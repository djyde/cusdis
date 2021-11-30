import { Box, Container, Heading, Text, Input, Button, VStack, Image, useToast } from "@chakra-ui/react"
import router from "next/router"
import React from "react"
import { useMutation } from "react-query"
import { Head } from "../components/Head"
import { ProjectService } from "../service/project.service"
import { apiClient } from "../utils.client"
import { getSession } from "../utils.server"



export const createProject = async (body: { title: string }) => {
  const res = await apiClient.post("/projects", {
    title: body.title,
  })
  return res.data
}

function GettingStart() {
  const createProjectMutation = useMutation(createProject)
  const toast = useToast()
  const titleInputRef = React.useRef<HTMLInputElement>(null)


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
          toast({
            status: "success",
            title: "Project created",
          })
          router.push(`/dashboard/project/${data.data.id}`, null, {
            shallow: true,
          })
        },
      }
    )
  }
  return (
    <>
      <Head title="Getting Start" />
      <Container mt="24">
        <Image w={24} src="/images/artworks/logo-256.png" mb="16">

        </Image>

        <Heading mb="4" mt="4">
          Getting Start
        </Heading>
        <Box border="1px solid" borderColor="gray.200" p="4" rounded="md" bgColor="gray.50">
          <VStack align="stretch" spacing={4}>
            <Text>
              Create your first website to start using Cusdis:
            </Text>
            <Box bgColor="white">
              <Input ref={titleInputRef}></Input>
            </Box>
            <Box>
              <Button onClick={_ => void onClickCreateProject()} isLoading={createProjectMutation.isLoading} colorScheme="blue">Create</Button>
            </Box>
          </VStack>
        </Box>
      </Container>
    </>
  )
}

export async function getServerSideProps(ctx) {

  const session = await getSession(ctx.req)

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false
      }
    }
  }

  const projectService = new ProjectService(ctx.req)

  const defaultProject = await projectService.getFirstProject(session.uid, {
    select: {
      id: true
    }
  })

  if (defaultProject) {
    // redirect to project dashboard
    return {
      redirect: {
        destination: `/dashboard/project/${defaultProject.id}`,
        permanent: false
      }
    }
  }

  return {
    props: {

    }
  }
}

export default GettingStart