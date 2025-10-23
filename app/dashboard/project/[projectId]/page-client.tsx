'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { CommentItem, CommentWrapper } from '../../../../service/comment.service'
import { apiClient } from '../../../../utils.client'
import { UserSession } from '../../../../service'
import { MainLayout } from '../../../../components/Layout'
import { AiOutlineCheck, AiOutlineSmile } from 'react-icons/ai'
import { List, Stack, Box, Text, Group, Anchor, Button, Pagination, Textarea, Center } from '@mantine/core'
import { MainLayoutData } from '../../../../service/viewData.service'
import { notifications } from '@mantine/notifications'
import type { Project } from '@prisma/client'

type ProjectServerSideProps = Pick<Project, 'ownerId' | 'id' | 'title' | 'token' | 'enableNotification' | 'webhook' | 'enableWebhook'>

const getComments = async ({ queryKey }) => {
  const [_key, { projectId, page }] = queryKey
  const res = await apiClient.get<{
    data: CommentWrapper,
  }>(`/project/${projectId}/comments`, {
    params: {
      page,
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

function CommentToolbar(props: {
  comment: CommentItem,
  refetch: any,
}) {

  const [replyContent, setReplyContent] = React.useState("")
  const [isOpenReplyForm, setIsOpenReplyForm] = React.useState(false)

  const approveCommentMutation = useMutation({
    mutationFn: approveComment,
    onSuccess() {
      props.refetch()
    },
    onError(data: any) {
      const {
        error: message,
        status: statusCode
      } = data.response.data

      notifications.show({
        title: "Error",
        message,
        color: 'yellow'
      })
    }
  })
  const replyCommentMutation = useMutation({
    mutationFn: replyAsModerator,
    onSuccess() {
      setIsOpenReplyForm(false)
      props.refetch()
    }
  })
  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
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
          <Button loading={approveCommentMutation.isPending} onClick={_ => {
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
        <Button loading={deleteCommentMutation.isPending} onClick={_ => {
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
          <Button loading={replyCommentMutation.isPending} onClick={_ => {
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

export default function ProjectPageClient(props: {
  project: ProjectServerSideProps,
  session: UserSession,
  mainLayoutData: MainLayoutData
}) {
  const [page, setPage] = React.useState(1)
  const params = useParams()
  const projectId = (params?.projectId as string) || ''

  const getCommentsQuery = useQuery({
    queryKey: ['getComments', { projectId, page }],
    queryFn: getComments,
  })

  return (
    <MainLayout id="comments" project={props.project} {...props.mainLayoutData}>
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
                      <Anchor href={comment.page.url || '#'} target="_blank">{comment.page.slug}</Anchor>
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
        {getCommentsQuery.data?.data.length === 0 && (
          <Box p={'xl'} sx={{
            backgroundColor: '#fff'
          }}>
            <Center>
              <Text color="gray" size="sm">
                No comments yet
              </Text>
            </Center>
          </Box>
        )}
        <Box>
          <Pagination total={getCommentsQuery.data?.pageCount || 0} value={page} onChange={count => {
            setPage(count)
          }} />
        </Box>
      </Stack>
    </MainLayout>
  )
}

