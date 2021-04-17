import * as React from 'react'
import { signIn, useSession } from 'next-auth/client'
import { apiClient } from '../../utils.client'
import { useMutation, useQuery } from 'react-query'
import { Box, Button, Container, Flex, FormControl, FormLabel, Heading, Input, Link, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Stack, Tag, toast, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Project } from '@prisma/client'
import { ChevronDownIcon } from '@chakra-ui/icons'
import type { UserSession } from '../../service'
import { useRouter } from 'next/router'

export const createProject = async (body: {
  title: string
}) => {
  const res = await apiClient.post('/projects', {
    title: body.title
  })
  return res.data
}

export const getAllProjects = async () => {
  const res = await apiClient.get('/projects')
  return res.data.data
}

function CreateProjectForm() {
  const mutation = useMutation(createProject)
  const form = useForm()
  async function onSubmit(data) {
    await mutation.mutate({
      title: data.title
    })
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormControl id="title">
        <Input type="text" {...form.register('title')}></Input>
      </FormControl>
      <FormControl>
        <Button type="submit">Create Project</Button>
      </FormControl>
    </form>
  )
}

export function Navbar(props: {
  session: UserSession,
  projectId?: string
}) {

  const router = useRouter()
  const toast = useToast()

  const getProjects = useQuery<Project[]>('getProjects', getAllProjects, {
    enabled: !!props.session,
    initialData: []
  })

  const createProjectModal = useDisclosure()

  const createProjectMutation = useMutation(createProject)

  const form = useForm()

  async function onSubmit(data) {
    await createProjectMutation.mutate({
      title: data.title
    }, {
      onSuccess(data) {
        toast({
          status: 'success',
          title: 'Project created'
        })
        router.push(`/dashboard/project/${data.data.id}`)
        createProjectModal.onClose()
      }
    })
  }

  return (
    <Box py={4}>
      <Modal
        isOpen={createProjectModal.isOpen}
        onClose={createProjectModal.onClose}
      >
        <ModalOverlay>

        </ModalOverlay>
        <form onSubmit={form.handleSubmit(onSubmit)}>

          <ModalContent>
            <ModalHeader>New project</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <FormControl isRequired id="title">
                <FormLabel>Title</FormLabel>
                <Input type="text" {...form.register('title')}></Input>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button type="submit">Create</Button>
            </ModalFooter>
          </ModalContent>
        </form>

      </Modal>
      <Container maxWidth={'5xl'}>
        <Flex >
          <Box>
            <Heading size="md">Cusdis</Heading>
          </Box>
          <Spacer />
          <Box>
            <Menu>
              <MenuButton rightIcon={<ChevronDownIcon />} as={Button}>Project</MenuButton>
              <MenuList>
                <MenuGroup title="Projects">
                  {getProjects.data.map(project => {
                    return (
                      <MenuItem onClick={_ => router.push(`/dashboard/project/${project.id}`)} key={project.id}>
                        <Box>
                          {project.title}
                        </Box>
                        <Spacer />
                        <Box>
                          {/* <Tag colorScheme="green">12</Tag> */}
                        </Box>
                      </MenuItem>
                    )
                  })}

                </MenuGroup>
                <MenuDivider />
                <MenuItem onClick={_ => createProjectModal.onOpen()}>New project</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>

      </Container>

    </Box>
  )
}

function Dashboard() {
  const [session, loading] = useSession()

  if (loading) {
    return 'Loading...'
  }

  if (!session) {
    signIn()
  }

  return (
    <>
      <Navbar session={session} />
    </>
  )
}

export async function getServerSideProps(ctx) {
  return {
    props: {

    }
  }
}

export default Dashboard