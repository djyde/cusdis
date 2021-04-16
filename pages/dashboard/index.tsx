import * as React from 'react'
import { signIn, useSession } from 'next-auth/client'
import { apiClient } from '../../utils.client'
import { useMutation, useQuery } from 'react-query'
import { Box, Button, Container, Flex, FormControl, Input, Link, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Spacer, Stack, Tag, VStack } from '@chakra-ui/react'
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

export function Navbar (props: {
  session: UserSession,
  projectId?: string
}) {

  const router = useRouter()

  const getProjects = useQuery<Project[]>('getProjects', getAllProjects, {
    enabled: !!props.session,
    initialData: []
  })

  return (
    <Box py={4}>
      <Container maxWidth={'6xl'}>
        <Flex >
          <Box>

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
                          <Tag colorScheme="green">12</Tag>
                        </Box>
                      </MenuItem>
                    )
                  })}

                </MenuGroup>
                <MenuDivider />
                <MenuItem>New project</MenuItem>
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
      <Container maxWidth={'6xl'}>
        {/* <CreateProjectForm /> */}
      </Container>
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