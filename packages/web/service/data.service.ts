import { prisma } from '../utils.server'

const parser = require('xml2json')
import TurndownService from 'turndown'
import { statService } from './stat.service'
const turndownService = new TurndownService()

export type DataSchema = {
  pages: Array<{
    uniqueId: string
    pageId: string
    url?: string
    title?: string
  }>
  comments: Array<{
    id: string
    content: string
    createdAt: string
    by_nickname: string
    by_email?: string
    pageUniqueId: string
    parentId: string
  }>
}

export class DataService {
  disqusAdapter(xmlData: string): DataSchema {
    const parsed = JSON.parse(parser.toJson(xmlData)).disqus
    const threads = (parsed.thread.filter(
      (_) => typeof _.id === 'string' && _.isDeleted === 'false',
    ) as Array<{
      'dsq:id': string
      id: string
      link: string
      title: string
      createdAt: string
      isDeleted: string
    }>).map((_) => {
      return {
        uniqueId: _['dsq:id'],
        pageId: _.id,
        url: _.link,
        title: _.title,
      } as DataSchema['pages'][0]
    })

    const posts = (parsed.post as Array<{
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
    }>)
      .map((_) => {
        return {
          pageUniqueId: _.thread['dsq:id'],
          by_nickname: _.author.name,
          content: turndownService.turndown(_.message),
          id: _['dsq:id'],
          createdAt: _.createdAt,
          pageId: _.thread['dsq:id'],
          parentId: _.parent?.['dsq:id'],
        } as DataSchema['comments'][0]
      })
      .filter(
        (post) =>
          threads.findIndex((_) => _.uniqueId === post.pageUniqueId) !==
          -1,
      )

    return {
      pages: threads,
      comments: posts,
    }
  }

  async import(projectId: string, schema: DataSchema) {
    const pages = await prisma.$transaction(
      schema.pages.map((thread) => {
        return prisma.page.upsert({
          where: {
            id: thread.uniqueId,
          },
          create: {
            id: thread.uniqueId,
            projectId,
            slug: thread.pageId,
            url: thread.url,
            title: thread.title,
          },
          update: {},
        })
      }),
    )

    const upsertedPosts = await prisma.$transaction(
      schema.comments.map((post) => {
        return prisma.comment.upsert({
          where: {
            id: post.id,
          },
          create: {
            id: post.id,
            content: post.content,
            createdAt: post.createdAt,
            by_nickname: post.by_nickname,
            pageId: post.pageUniqueId,
            parentId: post.parentId,
          },
          update: {},
        })
      }),
    )

    return {
      threads: pages,
      posts: upsertedPosts
    }
  }

  async importFromDisqus(projectId: string, xmlData: string) {

    const result = await this.import(projectId, this.disqusAdapter(xmlData))
    statService.capture('import_disqus')

    return result
  }
}
