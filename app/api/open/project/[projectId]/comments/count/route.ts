import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../../../utils.server'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { searchParams } = new URL(request.url)
  const { projectId } = params
  const pageIds = searchParams.get('pageIds')

  if (!pageIds) {
    return NextResponse.json({
      error: 'pageIds is required'
    }, { status: 400 })
  }

  const data = {}

  const counts = await prisma.$transaction(
    pageIds.split(',').map((id) => {
      return prisma.comment.count({
        where: {
          deletedAt: null,
          approved: true,
          page: {
            slug: id,
            projectId,
          },
        },
      })
    }),
  )

  counts.forEach((count, index) => {
    data[pageIds.split(',')[index]] = count
  })

  return NextResponse.json({
    data,
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  })
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}

