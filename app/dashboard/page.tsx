import { redirect } from "next/navigation"
import { Container } from "../components/ui/Container"
import { getSession } from "../utils/next-auth"
import { prisma } from "../utils/prisma"
import { ProjectList } from "./ProjectList"

export default async function Page() {
  return (
    <>
      <div className="">
        project
      </div>
    </>
  )
}