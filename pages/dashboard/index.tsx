import * as React from 'react'
import { signIn, useSession } from 'next-auth/client'
import { apiClient } from '../../utils.client'
import { useMutation } from 'react-query'
import { Box, Button, FormControl, Input } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
export const createProject = async (body: {
  title: string
}) => {
  const res = await apiClient.post('/projects', {
    title: body.title
  })
  return res.data
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
      Welcome {session.user.name}

      <Box>
        <CreateProjectForm />
      </Box>
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