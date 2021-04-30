import { Button } from "@chakra-ui/button"
import { Container, Text, VStack } from "@chakra-ui/layout"
import { Box, Divider, FormControl, FormLabel, Heading, Link, Textarea, useToast } from "@chakra-ui/react"
import { Comment, Page, Project } from "@prisma/client"
import { useRouter } from "next/router"
import React from "react"
import { useMutation } from "react-query"
import { Head } from "../../components/Head"
import { CommentService } from "../../service/comment.service"
import { SecretKey, TokenService } from "../../service/token.service"
import { apiClient } from "../../utils.client"
import { prisma } from "../../utils.server"
import { ErrorCode } from "../error"

const approveComment = async ({ token }) => {
  const res = await apiClient.post(`/open/approve?token=${token}`)
  return res.data
}

const appendReply = async ({  replyContent, token }) => {
  const res = await apiClient.post(`/open/approve?token=${token}`, {
    replyContent
  })
  return res.data
}

function ApprovePage(props: {
  comment: Comment & {
    page: Page & {
      project: Project
    }
  }
}) {

  const router = useRouter()
  const toast = useToast()

  const [replyContent, setReplyContent] = React.useState('')

  const appendReplyMutation = useMutation(appendReply, {
    onSuccess() {
      toast({
        title: 'Success',
        status: "success",
        position: 'top'
      })
      setReplyContent('')
    },
    onError() {
      toast({
        title: 'Something went wrong',
        status: "error",
        position: 'top'
      })
    }
  })
  const approveCommentMutation = useMutation(approveComment, {
    onSuccess() {
      toast({
        title: 'Success',
        status: "success",
        position: 'top'
      })
      location.reload()
    },
    onError() {
      toast({
        title: 'Something went wrong',
        status: "error",
        position: 'top'
      })
    }
  })

  return (
    <>
      <Head title="New comment - Cusdis" />
      <Container mt={12} my={12}>
        <Heading mb={12}>
          Cusdis
        </Heading>
        <VStack alignItems="start" spacing={4}>
          <Text>New comment on project <strong>{props.comment.page.project.title}</strong>, page <Link fontWeight="bold" isExternal href={props.comment.page.url}>{props.comment.page.title || props.comment.page.slug}</Link></Text>
          <Text><strong>{props.comment.by_nickname}</strong> ({props.comment.by_email || 'Email not provided'})</Text>
          <Text whiteSpace="pre-wrap" as='pre' bgColor="gray.100" p={2} w="full">{props.comment.content}</Text>

          <Box>
            {
              props.comment.approved ? <Button disabled>Approved</Button> : <Button onClick={_ => {
                approveCommentMutation.mutate({
                  token: router.query.token as string
                })
              }} isLoading={approveCommentMutation.isLoading} colorScheme="telegram">
                Approve
          </Button>
            }
          </Box>

        </VStack>

        <Divider my={8}></Divider>

        <VStack mt={4} alignItems="start">
          <FormControl>
            <FormLabel>Append reply as moderator</FormLabel>

            <Textarea value={replyContent} onChange={e => setReplyContent(e.target.value)}></Textarea>
          </FormControl>

          <Text fontSize="sm" color="gray.500">* Appending reply to a comment will automatically approve the comment</Text>
        </VStack>

        <Button onClick={_ => {
          appendReplyMutation.mutate({
            token: router.query.token as string,
            replyContent
          })
        }} isLoading={appendReplyMutation.isLoading} mt={4}>Append</Button>

      </Container>
    </>
  )
}

function redirectError(code: ErrorCode) {
  return {
    redirect: {
      destination: `/error?code=${code}`,
      permanent: false
    }
  }
}

export async function getServerSideProps(ctx) {

  const tokenService = new TokenService()
  const commentService = new CommentService(ctx.req)

  const { token } = ctx.query

  if (!token) {
    return redirectError(ErrorCode.INVALID_TOKEN)
  }

  let commentId

  try {
    commentId = tokenService.validate(token, SecretKey.ApproveComment).commentId
  } catch (e) {
    return redirectError(ErrorCode.INVALID_TOKEN)
  }


  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId
    },
    select: {
      by_nickname: true,
      by_email: true,
      content: true,
      approved: true,
      page: {
        select: {
          title: true,
          slug: true,
          url: true,
          project: {
            select: {
              title: true
            }
          }
        }
      }
    }
  })

  return {
    props: {
      comment
    }
  }
}

export default ApprovePage