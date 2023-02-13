'use client'

import classnames from "classnames";
import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'

export default function Navbar() {
  const segment = useSelectedLayoutSegment()
  const pathname = usePathname()
  const projectId = pathname.split('/').pop()

  return (
    <div>
      <div className={classnames('px-8 flex gap-4 text-gray-700 font-light border-b')}>
        <Link className={classnames({
          'border-b-2 border-black -mb-[1.5px]': segment === null
        })} href="/dashboard">Overview</Link>
        <Link className={classnames({
          'border-b-2 border-black -mb-[1.5px]': segment === 'settings'
        })} href={`/dashboard/projects/${projectId}/settings`}>Settings</Link>
      </div>
    </div>
  )
}