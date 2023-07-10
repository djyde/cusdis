import { AlertDialog, ModalCloseButton, AlertDialogBody, Icon, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box as ChakraBox, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button as ChakraButton, Center, Checkbox, Code, Container, CSSObject, Divider, Flex, FormControl, Heading, HStack, Input, InputGroup, InputRightElement, Link, Spacer, Spinner, StackDivider, Stat, StatGroup, StatLabel, StatNumber, Switch, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text as ChakraText, Textarea as ChakraTextarea, toast, Tooltip, useDisclosure, useToast, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Drawer, DrawerOverlay, DrawerContent, DrawerBody, DrawerCloseButton, ListItem } from '@chakra-ui/react'
import { Comment, Page, Project } from '@prisma/client'
import { session, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
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
import { MainLayout } from '../../../components/Layout'
import { AiOutlineCode, AiOutlineUnorderedList, AiOutlineControl, AiOutlineCheck, AiOutlineClose, AiOutlineSmile } from 'react-icons/ai'
import { List, Stack, Box, Text, Group, Anchor, Button, Pagination, Textarea } from '@mantine/core'

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

const deleteProject = async ({ projectId }) => {
  const res = await apiClient.delete<{
    data: string
  }>(`/project/${projectId}`)
  return res.data.data
}

const updateProjectSettings = async ({ projectId, body }) => {
  const res = await apiClient.put(`/project/${projectId}`, body)
  return res.data
}

function CommentToolbar(props: {
  comment: CommentItem,
  refetch: any,
}) {

  const [replyContent, setReplyContent] = React.useState("")
  const [isOpenReplyForm, setIsOpenReplyForm] = React.useState(false)

  const approveCommentMutation = useMutation(approveComment, {
    onSuccess() {
      props.refetch()
    }
  })
  const replyCommentMutation = useMutation(replyAsModerator, {
    onSuccess() {
      setIsOpenReplyForm(false)
      props.refetch()
    }
  })
  const deleteCommentMutation = useMutation(deleteComment, {
    onSuccess() {
      props.refetch()
    }
  })

  return (
    <Stack>
      <Group spacing={4}>
        {props.comment.approved ? (
          <Button leftIcon={<AiOutlineCheck />} color="green" size="xs" variant={'light'}>
            Approved
          </Button>
        ) : (
          <Button loading={approveCommentMutation.isLoading} onClick={_ => {
            if (window.confirm("Are you sure you want to approve this comment?")) {
              approveCommentMutation.mutate({
                commentId: props.comment.id
              })
            }
          }} leftIcon={<AiOutlineSmile />} size="xs" variant={'subtle'}>
            Approve
          </Button>
        )}
        <Button onClick={_ => {
          setIsOpenReplyForm(!isOpenReplyForm)
        }} size="xs" variant={'subtle'}>
          Reply
        </Button>
        <Button loading={deleteCommentMutation.isLoading} onClick={_ => {
          if (window.confirm("Are you sure you want to delete this comment?")) {
            deleteCommentMutation.mutate({
              commentId: props.comment.id
            })
          }
        }} color="red" size="xs" variant={'subtle'}>
          Delete
        </Button>
      </Group>
      {
        isOpenReplyForm &&
        <Stack>
          <Textarea
            autosize
            minRows={2}
            onChange={e => setReplyContent(e.currentTarget.value)}
            placeholder="Reply as moderator"
            sx={{
              // width: 512,
              // maxWidth: '100%'
            }} />
          <Button loading={replyCommentMutation.isLoading} onClick={_ => {
            replyCommentMutation.mutate({
              parentId: props.comment.id,
              content: replyContent
            })
          }} disabled={replyContent.length === 0} size="xs">Reply and approve</Button>
        </Stack>
      }
    </Stack>
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


  const { commentCount = 0, pageCount = 0 } = getCommentsQuery.data || {}

  return (
    <>
      <MainLayout id="comments" session={props.session}>
        <Stack>
          <List listStyleType={'none'} styles={{
            root: {
              border: '1px solid #eee'
            },
            item: {
              backgroundColor: '#fff',
              padding: 12,
              ':not(:last-child)': {
                borderBottom: '1px solid #eee',
              }
              // borderBottom: '1px solid #eee',
            }
          }}>
            {getCommentsQuery.data?.data.map(comment => {
              return (
                <List.Item key={comment.id}>
                  <Stack>
                    <Stack spacing={4}>
                      <Group spacing={8} sx={{
                        fontSize: 14
                      }}>
                        <Text sx={{
                          fontWeight: 500
                        }}>
                          {comment.by_nickname}
                        </Text>
                      </Group>
                      <Group spacing={8} sx={{
                        fontSize: 12
                      }}>
                        <Text sx={{
                        }}>
                          {comment.parsedCreatedAt}
                        </Text>
                        <Text>
                          on
                        </Text>
                        <Anchor href={comment.page.url} target="_blank">{comment.page.slug}</Anchor>
                      </Group>
                      <Box sx={{
                        marginTop: 8
                      }}>
                        {comment.content}
                      </Box>
                    </Stack>
                    <Group sx={{
                    }}>
                      <CommentToolbar comment={comment} refetch={getCommentsQuery.refetch} />
                    </Group>
                  </Stack>
                </List.Item>
              )
            })}
          </List>
          <Box>
            <Pagination total={getCommentsQuery.data?.pageCount || 0} value={page} onChange={count => {
              setPage(count)
            }} />
          </Box>
        </Stack>
      </MainLayout>
    </>
  )
}

function Settings(props: {
  project: ProjectServerSideProps
}) {

  const importFile = React.useRef(null)
  const toast = useToast()

  const enableNotificationMutation = useMutation(updateProjectSettings)
  const enableWebhookMutation = useMutation(updateProjectSettings)
  const updateWebhookUrlMutation = useMutation(updateProjectSettings)
  const deleteProjectMutation = useMutation(deleteProject, {
    onSuccess() {
      toast({
        title: 'Deleted',
        status: 'success',
        position: 'top'
      })
      location.href = "/dashboard"
    },
    onError() {
      toast({
        title: 'Something went wrong',
        status: 'error',
        position: 'top'
      })
    }
  })

  const [isOpenDeleteProjectModal, setIsOpenDeleteProjectModal] = React.useState(false)
  const cancelDeleteProjectRef = React.useRef()
  const onCloseDeleteProjectModal = () => {
    setIsOpenDeleteProjectModal(false)
  }

  const webhookInputRef = useRef<HTMLInputElement>(null)

  const uploadMutation = useMutation(upload, {
    onSuccess(data) {
      toast({
        title: 'Import success',
        description: `imported ${data.commentCount} comments`,
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
    const res = await apiClient.post<{
      data: {
        pageCount: number,
        commentCount: number,
      }
    }>(`/project/${props.project.id}/data/import`, formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
    return res.data.data
  }

  const onSaveWebhookUrl = async _ => {
    const value = webhookInputRef.current.value

    const validUrlRegexp = /^https?:/

    if (!validUrlRegexp.exec(value)) {
      toast({
        title: 'Not a valid http/https URL',
        status: 'error',
        position: 'top'
      })
      return
    }

    updateWebhookUrlMutation.mutate({
      projectId: props.project.id,
      body: {
        webhookUrl: value
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
  }

  const onChangeEnableWebhook = async _ => {
    const value = _.target.checked
    enableWebhookMutation.mutate({
      projectId: props.project.id,
      body: {
        enableWebhook: value
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
  }


  const DeleteProjectDialog = (
    <AlertDialog
      isOpen={isOpenDeleteProjectModal}
      leastDestructiveRef={cancelDeleteProjectRef}
      onClose={onCloseDeleteProjectModal}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Project
          </AlertDialogHeader>

          <AlertDialogBody>
            <ChakraText>
              Are you sure?
            </ChakraText>
            <ChakraBox mt={2}>
              <Link fontSize="sm" color="telegram.500" href='/doc#/faq?id=what-if-i-delete-a-project'>What if I delete a project?</Link>
            </ChakraBox>
          </AlertDialogBody>

          <AlertDialogFooter>
            <ChakraButton ref={cancelDeleteProjectRef} onClick={onCloseDeleteProjectModal}>
              Cancel
            </ChakraButton>
            <ChakraButton ml={4} colorScheme="red" onClick={_ => deleteProjectMutation.mutate({ projectId: props.project.id })} isLoading={deleteProjectMutation.isLoading}>Delete</ChakraButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )

  return (
    <>
      <VStack
        spacing={8}
        alignItems="stretch"
      >
        <VStack alignItems="start">
          <HStack mt={4}>
            <Switch onChange={e => {
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
            }} defaultChecked={props.project.enableNotification}></Switch>
            <Heading as="h1" size="md">Email Notification</Heading>

          </HStack>
          <ChakraBox>
            <Link href="/user" fontSize="sm">
              Advanced Notification Settings
            </Link>
          </ChakraBox>
        </VStack>

        <VStack alignItems="start">
          <HStack>
            <Switch onChange={onChangeEnableWebhook} defaultChecked={props.project.enableWebhook} />
            <Heading size="md">Webhook</Heading>
          </HStack>
          <InputGroup>
            <Input defaultValue={props.project.webhook} type="text" ref={webhookInputRef}></Input>
            <InputRightElement width='16'>
              <ChakraButton size="sm" isLoading={updateWebhookUrlMutation.isLoading} onClick={onSaveWebhookUrl}>Save</ChakraButton>
            </InputRightElement>
          </InputGroup>
          <Link fontSize="sm" color="gray.500" textDecor="underline" isExternal href="/doc#/advanced/webhook">How to use Webhook?</Link>
        </VStack>

        <ChakraBox>
          <Heading as="h1" size="md" my={4}>Data</Heading>
          <Heading as="h2" size="sm" my={4}>Import from Disqus</Heading>
          <HStack>
            <Input type="file" onChange={onChangeFile} />
            <ChakraButton onClick={_ => {
              if (importFile.current) {
                uploadMutation.mutate()
              }
            }} isLoading={uploadMutation.isLoading}>Import</ChakraButton>

          </HStack>

          {/* <Heading as="h2" size="sm" my={4}>Export</Heading> */}

        </ChakraBox>

        <ChakraBox>
          <Heading as="h1" size="md" my={4}>Danger Zone</Heading>
          <ChakraButton size="sm" colorScheme="red" onClick={_ => setIsOpenDeleteProjectModal(true)} isLoading={deleteProjectMutation.isLoading}>Delete project</ChakraButton>
          {/* <Heading as="h2" size="sm" my={4}>Export</Heading> */}
          {DeleteProjectDialog}
        </ChakraBox>

      </VStack>


    </>
  )
}

type ProjectServerSideProps = Pick<Project, 'ownerId' | 'id' | 'title' | 'token' | 'enableNotification' | 'webhook' | 'enableWebhook'>

export async function getServerSideProps(ctx) {
  const projectService = new ProjectService(ctx.req)
  const session = await getSession(ctx.req)
  const project = await projectService.get(ctx.query.projectId) as Project

  if (project.deletedAt) {
    return {
      redirect: {
        destination: '/404',
        permanent: false
      }
    }
  }

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
        enableNotification: project.enableNotification,
        enableWebhook: project.enableWebhook,
        webhook: project.webhook
      } as ProjectServerSideProps
    }

  }
}

export default ProjectPage
