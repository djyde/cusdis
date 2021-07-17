import { NextApiRequest, NextApiResponse } from 'next'
import {
  apiHandler,
  initMiddleware,
  prisma,
} from '../../../../../../utils.server'
import Cors from 'cors'

export default apiHandler()
  .use(
    Cors({
      // Only allow requests with GET, POST and OPTIONS
      methods: ['GET', 'POST', 'OPTIONS'],
    })
  )
  .get(async (req, res) => {
    const { projectId, pageIds } = req.query as {
      pageIds: string
      projectId: string
    }

    const data = {}

    const counts = (
      await prisma.$transaction(
        pageIds.split(',').map((id) => {
          return prisma.comment.count({
            where: {
              deletedAt: null,
              page: {
                slug: id,
                projectId,
              },
            },
          })
        }),
      )
    ).forEach((count, index) => {
      data[pageIds.split(',')[index]] = count
    })

    res.json({
      data,
    })
  })
