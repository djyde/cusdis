import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession, prisma } from '../../../utils.server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const session = await getSession(req)
    await prisma.user.update({
      where: {
        id: session.uid
      },
      data: {
        displayName: req.body.displayName,
      }
    })
    console.log(session)
    res.json({})
  } 
}