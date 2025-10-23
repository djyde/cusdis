'use client'

import { Container, Stack, Title, Text, Divider, Textarea, Box, Button, Anchor } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { Comment, Page, Project } from "@prisma/client"
import React from "react"
import { useMutation } from "@tanstack/react-query"
import { Head } from "../../../components/Head"
import { apiClient } from "../../../utils.client"

const approveComment = async ({ token }) => {
  const res = await apiClient.post(`/open/approve?token=${token}`)
  return res.data
}

const appendReply = async ({ replyContent, token }) => {
  const res = await apiClient.post(`/open/approve?token=${token}`, {
    replyContent
  })
  return res.data
}

export default function ApprovePageClient(props: {
  comment: Comment & {
    page: Page & {
      project: Project
    }
  }
  token: string
}) {

  const [replyContent, setReplyContent] = React.useState('')

  const appendReplyMutation = useMutation({
    mutationFn: appendReply,
    onSuccess() {
      notifications.show({
        title: 'Success',
        message: 'Reply appended',
        color: 'green'
      })
      setReplyContent('')
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
  const approveCommentMutation = useMutation({
    mutationFn: approveComment,
    onSuccess() {
      notifications.show({
        title: 'Success',
        message: 'Reply appended',
        color: 'green'
      })

      location.reload()
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

  return (
    <>
      <Head title="New comment - Cusdis" />
      <Container mt={12} my={12}>
        <Stack>
          <Title mb={12}>
            Cusdis
          </Title>

          <Stack spacing={4}>
            <Text>New comment on site <strong>{props.comment.page.project.title}</strong>, page <Anchor weight={'bold'} target="_blank" href={props.comment.page.url}>{props.comment.page.title || props.comment.page.slug}</Anchor></Text>
            <Text>From: <strong>{props.comment.by_nickname}</strong> ({props.comment.by_email || 'Email not provided'})</Text>
            <Text sx={theme =>({
              whiteSpace: 'pre-wrap',
              backgroundColor: theme.colors.gray[0],
              padding: theme.spacing.md
            })} component='pre' w="full" size="sm">{props.comment.content}</Text>
          </Stack>

          <Box>
            {
              props.comment.approved ? <Button disabled>Approved</Button> :               <Button onClick={_ => {
                approveCommentMutation.mutate({
                  token: props.token
                })
              }} loading={approveCommentMutation.isPending} color="telegram">
                Approve
              </Button>
            }
          </Box>

          <Divider my={24} />

          <Stack>
            <Textarea placeholder="Your comment..." value={replyContent} onChange={e => setReplyContent(e.target.value)}></Textarea>
            <Text size="sm" color="gray">* Appending reply to a comment will automatically approve the comment</Text>

            <Button onClick={_ => {
              appendReplyMutation.mutate({
                token: props.token,
                replyContent
              })
            }} loading={appendReplyMutation.isPending} mt={4}>Append reply</Button>
          </Stack>

        </Stack>


      </Container>
    </>
  )
}

