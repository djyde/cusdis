'use client'

import classnames from "classnames";
import Link from "next/link";

export default function Navbar(props: {
  session: any
}) {
  return (
    <nav className={classnames('flex gap-4 justify-between px-8 pt-8 pb-4')}>
      <Link href="/dashboard">
        <h1 className='font-bold'>Cusdis</h1>
      </Link>
      <div className="flex text-gray-500 gap-4">
        <a href="/doc">Doc</a>
        <Link href="/dashboard/settings">Settings</Link>
        <div>
          <div>
            {props.session.user.name}
          </div>
        </div>
      </div>
    </nav>
  )
}