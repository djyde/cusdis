import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Center, Checkbox, Code, Container, Divider, Flex, FormControl, Heading, HStack, Input, Link, Spacer, Spinner, StackDivider, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, Textarea, toast, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { Comment, Page, Project } from '@prisma/client'
import { session, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import React from 'react'
import { useMutation, useQuery } from 'react-query'
import { ProjectService } from '../../../service/project.service'
import { CommentItem, CommentWrapper } from '../../../service/comment.service'
import { apiClient } from '../../../utils.client'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { UserSession } from '../../../service'
import { Head } from '../../../components/Head'
import { Navbar } from '../../../components/Navbar'
import { getSession } from '../../../utils.server'
import { Footer } from '../../../components/Footer'

const getComments = async ({ queryKey }) => {
  const [_key, { projectId, page }] = queryKey
  const res = await apiClient.get<{
    data: CommentWrapper,
  }>(`/project/${projectId}/comments`, {
    params: {
      page
    }
  })
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

const generateToken = async ({ projectId }) => {
  const res = await apiClient.post<{
    data: string
  }>(`/project/${projectId}/generateToken`)
  return res.data.data
}

const updateProjectSettings = async ({ projectId, body }) => {
  const res = await apiClient.put(`/project/${projectId}`, body)
  return res.data
}

function CommentComponent(props: {
  isRoot: boolean,
  refetch: any,
  comment: CommentItem
}) {
  const toast = useToast()

  const refetch = props.refetch
  const comment = props.comment

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
        setShowReplyForm(false)
      }
    })

    return (
      <>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormControl>
            <Textarea {...form.register('content')} placeholder="Reply as moderator" />
          </FormControl>
          <FormControl>
            <Button isLoading={replyMutation.isLoading} type="submit">Send</Button>
          </FormControl>
        </form>
      </>
    )
  }

  return (
    <Box key={comment.id} pl={!props.isRoot ? 4 : 0}>
      <HStack spacing={2}>
        <Link color="gray.500" href={comment.page.url}>{comment.page.slug}</Link>
        <Spacer />

        {comment.moderatorId && <Tag colorScheme="cyan" size="sm">MOD</Tag>}
        {!comment.moderatorId && (comment.approved ? <Tag colorScheme="green" size="sm">Approved</Tag> : <Tag colorScheme="orange" size="sm">Pending</Tag>)}

      </HStack>
      <HStack spacing={2}>
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

      </HStack>

      <Box>
        <div dangerouslySetInnerHTML={{ __html: comment.parsedContent }}></div>
      </Box>

      <HStack mt={2} spacing={4}>
        <Button isLoading={approveCommentMutation.isLoading} disabled={comment.approved} type="button" variant="link" size="sm" onClick={_ => approveCommentMutation.mutate({ commentId: comment.id })}>Approve</Button>
        <Button type="button" variant="link" size="sm" onClick={_ => setShowReplyForm(true)} >Reply</Button>
        <Button isLoading={deleteCommentMutation.isLoading} type="button" variant="link" size="sm" onClick={_ => deleteCommentMutation.mutate({ commentId: comment.id })}>Delete</Button>
      </HStack>

      <Box mt={4}>
        {showReplyForm && <ReplyForm parentId={comment.id} />}
      </Box>

      { comment.replies.data.length > 0 && comment.replies.data.map(reply => <CommentComponent {...props} comment={reply} isRoot={false} />)}
    </Box>
  )
}

function ProjectPage(props: {
  project: ProjectServerSideProps,
  session: UserSession
}) {

  React.useEffect(() => {
    if (!props.session) {
      signIn()
    }
  }, [!props.session])

  if (!props.session) {
    return <div>Redirecting to signin..</div>
  }

  const [page, setPage] = React.useState(1)
  const router = useRouter()

  const getCommentsQuery = useQuery(['getComments', { projectId: router.query.projectId as string, page }], getComments, {
  })

  const { commentCount = 0, pageCount = 1 } = getCommentsQuery.data || {}

  return (
    <>
      <Head title={props.project.title} />
      <Navbar session={props.session} />

      <Container maxWidth="5xl" mt={24}>
        <VStack alignItems="stretch" spacing={4}>
          <VStack spacing={2} alignItems="start">
            <Heading>
              {props.project.title}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              {props.project.id}
            </Text>
          </VStack>

          <Box>
            <Tabs size="md" >
              <TabList>
                <Tab>Comments</Tab>
                <Tab>Settings</Tab>
              </TabList>

              <TabPanels>
                <TabPanel px={0} py={8}>
                  {getCommentsQuery.isLoading && <Center p={8}><Spinner /></Center>}
                  <VStack alignItems="stretch" spacing={4}>
                    <VStack align="stretch" spacing={4} divider={<StackDivider borderColor="gray.200" />}>
                      {commentCount === 0 && !getCommentsQuery.isLoading ? <Text py={12} textAlign="center" color="gray.500">No Comments</Text> : null}
                      {getCommentsQuery.data?.data.map(comment => <CommentComponent isRoot key={comment.id} refetch={getCommentsQuery.refetch} comment={comment} />)}
                    </VStack>
                    <HStack spacing={2} mt={8}>
                      {new Array(pageCount).fill(0).map((_, index) => {
                        return (
                          <Link bgColor={page === index + 1 ? 'blue.50' : ''} px={2} key={index} onClick={_ => setPage(index + 1)}>{index + 1}</Link>
                        )
                      })}
                    </HStack>
                  </VStack>
                </TabPanel>
                <TabPanel px={0} py={8}>
                  <Settings project={props.project} />
                </TabPanel>
              </TabPanels>
            </Tabs>

          </Box>
        </VStack>


      </Container>

      <Footer maxWidth="5xl" />
    </>
  )
}

function Settings(props: {
  project: ProjectServerSideProps
}) {

  const importFile = React.useRef(null)
  const toast = useToast()

  const enableNotificationMutation = useMutation(updateProjectSettings)

  const uploadMutation = useMutation(upload, {
    onSuccess() {
      toast({
        title: 'Saved',
        status: 'success',
        position: 'top'
      })
    },
    onError() {
      toast({
        title: 'Something went wrong',
        status: 'error',
        position: 'top'
      })
    }
  })

  function onChangeFile(e) {
    const file = e.target.files[0]
    importFile.current = file
  }

  async function upload() {
    const formData = new FormData()
    formData.append('file', importFile.current)
    const res = await apiClient.post(`/project/${props.project.id}/data/import`, formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
    return res.data
  }

  return (
    <>
      <VStack
        spacing={8}
        alignItems="stretch"
      >
        <Box>
          <Heading as="h1" size="md" mb={4} >Embed Code</Heading>
          {typeof window !== 'undefined' && <Box as="pre" bgColor="gray.200" p={4} rounded={'md'} fontSize="sm">
            <code>
              {`<div id="cusdis_thread"
  data-host="${location.origin}"
  data-app-id="${props.project.id}"
  data-page-id="{{ PAGE_ID }}"
  data-page-url="{{ PAGE_URL }}"
  data-page-title="{{ PAGE_TITLE }}"
></div>
<script async defer src="${location.origin}/js/cusdis.es.js"></script>
`}
            </code>
          </Box>}
        </Box>

        <VStack alignItems="start">
          <Box>
            <Heading as="h1" size="md" my={4}>Notification</Heading>
            <Checkbox onChange={e => {
              enableNotificationMutation.mutate({
                projectId: props.project.id,
                body: {
                  enableNotification: e.target.checked
                }
              }, {
                onSuccess() {
                  toast({
                    title: 'Saved',
                    status: 'success',
                    position: 'top'
                  })
                },
                onError() {
                  toast({
                    title: 'Something went wrong',
                    status: 'error',
                    position: 'top'
                  })
                }
              })
            }} defaultChecked={props.project.enableNotification}>Enable Notification for this project</Checkbox>
          </Box>
          <Box>
            <Link href="/user" fontSize="sm">
              Advanced Notification Settings
            </Link>
          </Box>
        </VStack>

        <Box>
          <Heading as="h1" size="md" my={4}>Data</Heading>
          <Heading as="h2" size="sm" my={4}>Import from Disqus</Heading>
          <Input mb={2} type="file" onChange={onChangeFile} />
          <Button onClick={_ => uploadMutation.mutate()} isLoading={uploadMutation.isLoading}>Import</Button>

          {/* <Heading as="h2" size="sm" my={4}>Export</Heading> */}

        </Box>

      </VStack>


    </>
  )
}

type ProjectServerSideProps = Pick<Project, 'ownerId' | 'id' | 'title' | 'token' | 'enableNotification'>

export async function getServerSideProps(ctx) {
  const projectService = new ProjectService(ctx.req)
  const session = await getSession(ctx.req)
  const project = await projectService.get(ctx.query.projectId) as Project

  if (session && (project.ownerId !== session.uid)) {
    return {
      redirect: {
        destination: '/forbidden',
        permanent: false
      }
    }
  }

  return {
    props: {
      session: await getSession(ctx.req),
      project: {
        id: project.id,
        title: project.title,
        ownerId: project.ownerId,
        token: project.token,
        enableNotification: project.enableNotification
      } as ProjectServerSideProps
    }

  }
}

export default ProjectPage
