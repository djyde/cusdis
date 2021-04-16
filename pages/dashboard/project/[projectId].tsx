import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Container, Flex, Link, Spacer, StackDivider, Tag, Text, useToast, VStack } from '@chakra-ui/react'
import { Comment, Page, Project } from '@prisma/client'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { Navbar } from '..'
import { ProjectService } from '../../../service/project.service'
import { apiClient } from '../../../utils.client'

const getComments = async ({ queryKey }) => {
  const [_key, { projectId }] = queryKey
  const res = await apiClient.get<{
    data: Array<Comment & {
      page: Page
    }>
  }>(`/project/${projectId}/comments`)
  return res.data.data
}

const approveComment = async ({ commentId }) => {
  const res = await apiClient.post(`/comment/${commentId}/approve`)
  return res.data
}

function ProjectPage(props: {
  project: Project
}) {
  const [session, loading] = useSession()
  const toast = useToast()
  const router = useRouter()
  const getCommentsQuery = useQuery(['getComments', { projectId: router.query.projectId as string }], getComments, {
    initialData: []
  })

  const approveCommentMutation = useMutation(approveComment, {
    onSuccess() {
      toast({
        status: 'success',
        title: 'Approved'
      })
      getCommentsQuery.refetch()
    }
  })

  return (
    <>
      <Navbar session={session} />
      <Container maxWidth="6xl">
        <Box mb={4}>
          <Breadcrumb color="gray.500">
            <BreadcrumbItem>
              <Text>project</Text>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Text>{props.project.title}</Text>
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
        <Text mb={8} fontWeight="bold">Comments</Text>
        <VStack align="stretch" spacing={8} divider={<StackDivider borderColor="gray.200" />}>
          {getCommentsQuery.data.map(comment => {
            return (
              <Box key={comment.id}>
                <Flex>
                  <Link color="gray.500" href={comment.page.url}>{comment.page.slug}</Link>
                  <Spacer />

                  {comment.approved ? <Tag colorScheme="green" size="sm">Approved</Tag> : <Tag colorScheme="orange" size="sm">Pending</Tag>}

                </Flex>
                <Flex gridGap={2}>
                  <Text fontWeight="medium">
                    {comment.by_nickname}
                  </Text>

                  <Text color="gray.500">
                    {comment.createdAt}
                  </Text>
                  <Spacer />
                  <Text mt={2} color="gray.500" fontSize="sm">
                    {comment.by_email}
                  </Text>

                </Flex>


                <Box>
                  {comment.content}
                </Box>

                <Flex mt={2} gridGap={4}>
                  {comment.approved ? <Button type="button" variant="link" size="sm" onClick={_ => approveCommentMutation.mutate({ commentId: comment.id })}>Un Approve</Button> : <Button type="button" variant="link" size="sm" onClick={_ => approveCommentMutation.mutate({ commentId: comment.id })}>Approve</Button>}
                  
                  <Button type="button" variant="link" size="sm">Reply</Button>
                </Flex>
              </Box>
            )
          })}
        </VStack>

      </Container>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const projectService = new ProjectService(ctx.req)
  const project = await projectService.get(ctx.query.projectId)
  return {
    props: {
      project: {
        id: project.id,
        title: project.title
      }
    }
  }
}

export default ProjectPage