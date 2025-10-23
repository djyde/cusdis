import { redirect } from 'next/navigation'
import { Comment, Page, Project } from "@prisma/client"
import { TokenService, SecretKey } from "../../../service/token.service"
import { prisma } from "../../../utils.server"
import { ErrorCode } from "../../error/page"
import ApprovePageClient from './page-client'

export default async function ApprovePage({
  searchParams
}: {
  searchParams: { token?: string }
}) {
  const tokenService = new TokenService()

  const { token } = searchParams

  if (!token) {
    redirect(`/error?code=${ErrorCode.INVALID_TOKEN}`)
  }

  let commentId

  try {
    commentId = tokenService.validate(token, SecretKey.ApproveComment).commentId
  } catch (e) {
    redirect(`/error?code=${ErrorCode.INVALID_TOKEN}`)
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

  return <ApprovePageClient comment={comment} token={token} />
}

