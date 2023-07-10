import { AlertDialog, ModalCloseButton, AlertDialogBody, Icon, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box as ChakraBox, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button as ChakraButton, Center, Checkbox, Code, Container, CSSObject, Divider, Flex, FormControl, Heading, HStack, Input, InputGroup, InputRightElement, Link, Spacer, Spinner, StackDivider, Stat, StatGroup, StatLabel, StatNumber, Switch, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text as ChakraText, Textarea, toast, Tooltip, useDisclosure, useToast, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Drawer, DrawerOverlay, DrawerContent, DrawerBody, DrawerCloseButton, ListItem } from '@chakra-ui/react'
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
import { AiOutlineCode, AiOutlineUnorderedList, AiOutlineControl, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import { List, Stack, Box, Text, Group, Anchor, Button, Pagination } from '@mantine/core'

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
            <Textarea fontSize="xs" {...form.register('content')} placeholder="Reply as moderator" />
          </FormControl>
          <FormControl mt="2">
            <ChakraButton size="xs" isLoading={replyMutation.isLoading} type="submit">Send</ChakraButton>
          </FormControl>
        </form>
      </>
    )
  }

  const approveStyle: { [key: string]: any } = {
    "true": {
      borderBottomWidth: "1px",
      borderRightWidth: "1px",
      borderRightColor: "gray.100",
      borderLeftColor: "green.100"
    },
    "false": {
      borderBottomWidth: "1px",
      borderRightWidth: "1px",
      borderRightColor: "gray.100",
      borderLeftColor: "orange.100"
    }
  }

  return (
    <>
      {props.isRoot && (
        <>
          <ChakraBox mb="2" fontSize="sm" pl="0">
            <ChakraText as="div">
              <Link href={props.comment.page.url} isExternal fontWeight="medium">
                {props.comment.page.title}
              </Link>
            </ChakraText>
          </ChakraBox>
        </>
      )}
      <ChakraBox key={comment.id} pl={!props.isRoot ? 4 : 0} fontSize="xs">
        <VStack align="strech" borderTopWidth={props.isRoot ? "1px" : "0"} spacing="2" px="4" py="4" borderLeftWidth="4px" {...approveStyle[String(comment.approved)]} mb="0" >
          <Flex align="">
            <ChakraText fontWeight="medium">
              {comment.by_nickname} {comment.by_email && <>({comment.by_email})</>}
            </ChakraText>
            <Spacer />
            <ChakraText color="gray.400">
              {comment.parsedCreatedAt}
            </ChakraText>
          </Flex>

          <ChakraBox>
            <div dangerouslySetInnerHTML={{ __html: comment.parsedContent }}></div>
          </ChakraBox>

          <HStack spacing={4} pt="2">
            <ChakraButton isLoading={approveCommentMutation.isLoading} disabled={comment.approved} type="button" variant="link" size="xs" onClick={_ => approveCommentMutation.mutate({ commentId: comment.id })}>Approve</ChakraButton>
            <ChakraButton type="button" variant="link" size="xs" onClick={_ => setShowReplyForm(true)} >Reply</ChakraButton>
            <ChakraButton isLoading={deleteCommentMutation.isLoading} type="button" variant="link" size="xs" onClick={_ => confirm(`Are your sure?`) && deleteCommentMutation.mutate({ commentId: comment.id })}>Delete</ChakraButton>
          </HStack>
        </VStack>


        {showReplyForm && <ChakraBox py="2" pb="4"> <ReplyForm parentId={comment.id} /> </ChakraBox>}

        {comment.replies.data.length > 0 && comment.replies.data.map(reply => <CommentComponent key={reply.id} {...props} comment={reply} isRoot={false} />)}

      </ChakraBox>
    </>
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

  const embedCodeModal = useDisclosure()
  const preferencesModal = useDisclosure()

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
                        <Text>
                          on
                        </Text>
                        <Anchor href={comment.page.url} target="_blank">{comment.page.slug}</Anchor>
                      </Group>
                      <Box>
                        {comment.content}
                      </Box>
                    </Stack>
                    <Group sx={{
                    }}>
                      <Button.Group>
                        {comment.approved ? (
                          <Button size="xs" variant={'default'}>
                            Disapprove
                          </Button>
                        ) : (
                          <Button color="green"  size="xs" variant={'outline'}>
                            Approve
                          </Button>
                        )}
                        <Button size="xs" variant={'default'}>
                          Reply
                        </Button>
                      </Button.Group>
                    </Group>
                  </Stack>
                </List.Item>
              )
            })}
          </List>
          <Box>
            <Pagination total={getCommentsQuery.data?.pageCount || 0} value={pageCount} onChange={count => {
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
