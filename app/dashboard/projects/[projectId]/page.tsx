import { prisma } from "../../../utils/prisma"

export default async function Page(props) {

  const commentCount = await prisma.comment.count({
    where: {
      page: {
        id: props.params.projectId
      }
    }
  })

  const pages = await prisma.page.findMany({
    where: {
      projectId: props.params.projectId
    }
  })

  return (
    <div>
      {commentCount} comments

      {pages.map(page => {
        return (
          <div key={page.id}>
            {page.title}
          </div>
        )
      })}
    </div>
  )
}