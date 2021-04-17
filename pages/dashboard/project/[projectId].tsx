import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Container, Flex, FormControl, Link, Spacer, StackDivider, Tag, Text, Textarea, useToast, VStack } from '@chakra-ui/react'
import { Comment, Page, Project } from '@prisma/client'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { Navbar } from '..'
import { ProjectService } from '../../../service/project.service'
import { apiClient } from '../../../utils.client'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'

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

const deleteComment = async ({ commentId }) => {
  const res = await apiClient.delete(`/comment/${commentId}`)
  return res.data
}

const replyAsModerator = async ({ parentId, content }) => {
  const res = await apiClient.post(`/comment/${parentId}/replyAsModerator`, {
    content
  })
  return res.data.data
}

function CommentComponent({ comment, refetch }: {
  refetch: any,
  comment: Comment & {
    page: Page
  }
}) {
  const toast = useToast()

  const [showReplyForm, setShowReplyForm] = React.useState(false)

  const approveCommentMutation = useMutation(approveComment, {
    onSuccess() {
      toast({
        status: 'success',
        title: 'Approved',
        position: 'top'
      })
      refetch()
    }
  })

  const deleteCommentMutation = useMutation(deleteComment, {
    onSuccess() {
      toast({
        status: 'success',
        title: 'Deleted',
        position: 'top'
      })
      refetch()
    }
  })

  function ReplyForm(props: {
    parentId: string
  }) {
    const form = useForm()
    function onSubmit({ content }) {
      replyMutation.mutate({ content, parentId: props.parentId })
    }
    const replyMutation = useMutation(replyAsModerator, {
      onSuccess() {
        toast({
          status: 'success',
          title: 'Sent',
          position: 'top'
        })
        refetch()
      }
    })

    return (
      <>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormControl>
            <Textarea {...form.register('content')} placeholder="Reply as moderator" />
          </FormControl>
          <FormControl>
            <Button type="submit">Send</Button>
          </FormControl>
        </form>
      </>
    )
  }

  return (
    <Box key={comment.id}>
      <Flex gridGap={2}>
        <Link color="gray.500" href={comment.page.url}>{comment.page.slug}</Link>
        <Spacer />

        {comment.moderatorId && <Tag colorScheme="cyan">MOD</Tag>}
        {!comment.moderatorId && (comment.approved ? <Tag colorScheme="green" size="sm">Approved</Tag> : <Tag colorScheme="orange" size="sm">Pending</Tag>)}

      </Flex>
      <Flex gridGap={2}>
        <Text fontWeight="medium">
          {comment.by_nickname}
        </Text>

        <Text color="gray.500">
          {dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}
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
        <Button disabled={comment.approved} type="button" variant="link" size="sm" onClick={_ => approveCommentMutation.mutate({ commentId: comment.id })}>Approve</Button>
        <Button type="button" variant="link" size="sm" onClick={_ => setShowReplyForm(true)} >Reply</Button>
        <Button type="button" variant="link" size="sm" onClick={_ => deleteCommentMutation.mutate({ commentId: comment.id })}>Delete</Button>
      </Flex>

      <Box mt={4}>
        {showReplyForm && <ReplyForm parentId={comment.id} />}
      </Box>
    </Box>
  )
}

function ProjectPage(props: {
  project: Project
}) {
  const [session, loading] = useSession()
  const router = useRouter()
  const getCommentsQuery = useQuery(['getComments', { projectId: router.query.projectId as string }], getComments, {
    initialData: []
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
          {getCommentsQuery.data.map(comment => <CommentComponent key={comment.id} refetch={getCommentsQuery.refetch} comment={comment} />)}
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