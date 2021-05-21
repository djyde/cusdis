import { NextApiRequest, NextApiResponse } from 'next'
import { initMiddleware, prisma } from '../../../../../../utils.server'
import Cors from 'cors'

const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await cors(req, res)

  if (req.method === 'GET') {
    const { projectId, pageIds } = req.query as {
      pageIds: string
      projectId: string
    }

    const counts = (await prisma.$transaction(
      pageIds.split(',').map((id) => {
        return prisma.comment.count({
          where: {
            page: {
              slug: id,
              projectId,
            },
          },
        })
      }),
    )).map((count, index) => {
      return {
        pageId: pageIds.split(',')[index],
        count
      }
    })

    res.json({
      data: counts,
    })
  }
}
