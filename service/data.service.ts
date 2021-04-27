import { prisma } from '../utils.server'

const parser = require('xml2json')
import TurndownService from 'turndown'
const turndownService = new TurndownService()
export class DataService {
  async importFromDisqus(projectId: string, xmlData: string) {
    const parsed = JSON.parse(parser.toJson(xmlData)).disqus
    const threads = parsed.thread.filter(
      (_) => typeof _.id === 'string' && _.isDeleted === 'false',
    ) as Array<{
      'dsq:id': string
      id: string
      link: string
      title: string
      createdAt: string
      isDeleted: string
    }>
    const posts = parsed.post as Array<{
      'dsq:id': string
      message: string
      createdAt: string
      isDeleted: string
      thread: {
        'dsq:id': string
      }
      author: {
        name: string
        isAnonymous: string
        username: string
      }
      parent?: {
        'dsq:id': string
      }
    }>

    // import threads into pages
    const pages = await prisma.$transaction(
      threads.map((thread) => {
        return prisma.page.upsert({
          where: {
            id: thread['dsq:id'],
          },
          create: {
            id: thread['dsq:id'],
            projectId,
            slug: thread.id,
            url: thread.link,
            title: thread.title,
          },
          update: {},
        })
      }),
    )

    const filteredPosts = posts.filter((post) => {
      // filter the posts that missing parent thread
      return (
        threads.findIndex((_) => _['dsq:id'] === post.thread['dsq:id']) !== -1
      )
    })

    const upsertedPosts = await prisma.$transaction(
      filteredPosts
        .map((post) => {
          return prisma.comment.upsert({
            where: {
              id: post['dsq:id'],
            },
            create: {
              id: post['dsq:id'],
              content: turndownService.turndown(post.message),
              createdAt: post.createdAt,
              by_nickname: post.author.name,
              pageId: post.thread['dsq:id'],
              parentId: post.parent?.['dsq:id'],
            },
            update: {},
          })
        }),
    )

    return {
      threads: pages,
      posts: upsertedPosts,
    }
  }
}
