import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // get comments
    res.json({})
  }

  if (req.method === 'POST') {
    const session = await getSession({ req })
    console.log(session)
    // create comment
    const body = req.body as {
      comment: string,
      username?: string,
      email?: string,
    }
    
    res.json({})
  }
}