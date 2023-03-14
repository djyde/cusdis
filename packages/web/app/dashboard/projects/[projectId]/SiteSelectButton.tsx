import { ChevronDown, Plus } from "lucide-react"
import Link from "next/link"
import { } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/DropdownMenu"
import type { getUserProjects } from "./data"

export function SiteSelectButton(props: {
  activeProjectId: string
  projects: Awaited<ReturnType<typeof getUserProjects>>
}) {
  const currentProject = props.projects.find(project => project.id === props.activeProjectId)!

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="font-medium flex gap-2 items-center">
            {currentProject.title}
            <ChevronDown className="w-4 h-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link href="/new">
              <div className="font-bold flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New website
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {props.projects.map(project => {
            return (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <DropdownMenuItem>{project.title}</DropdownMenuItem>
              </Link>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}