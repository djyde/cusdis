import * as React from 'react'
import { signIn, useSession } from 'next-auth/client'
import { apiClient } from '../../utils.client'
import { useMutation } from 'react-query'
import { Box } from '@chakra-ui/react'

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
  return (
    <div>

    </div>
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