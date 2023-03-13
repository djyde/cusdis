import { getSession } from '../utils/next-auth'
import '../style.css'
import Navbar from './Navbar'
import { Inter } from '@next/font/google'
import classNames from 'classnames'
import { Providers } from '../utils/providers'
import { redirect } from 'next/navigation'
import { prisma } from '../utils/prisma'
import { Button } from '../components/ui/Button'
import {
  Globe
} from 'lucide-react'
import Link from 'next/link'
import { AddWebsiteButton } from './AddWebsiteButton'
import { Profile } from './Profile'
const inter = Inter({
  subsets: ["latin"],
})


export default async function Layout(props) {
  const session = await getSession()

  if (!session) {
    redirect('/api/auth/signin')
    // redirect to login
  }
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      title: true,
      enableNotification: true,
      enableWebhook: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      ownerId: session.uid,
      deletedAt: null
    }
  })

  return (
    <Providers>
      <div className={classNames(inter.className, 'antialiased', 'flex h-[100vh]')}>
        <div className='grid grid-cols-6 flex-1'>
          <aside className='relative col-span-2 lg:col-span-1 p-4 border-r border-r-slate-100'>
            <h1 className='font-bold text-2xl mb-8 ml-2'>
              Cusdis
            </h1>
            <div>
              <div className='ml-2 mb-2 flex justify-between'>
                <h2 className='font-bold'>Websites</h2>
              </div>
              <div>
                {projects.map(project => {
                  return (
                    <div key={project.id}>
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <Button variant='ghost' size="sm" justify='start' className='w-full'>
                          <Globe className='w-4 h-4 mr-2' />
                          {project.title}
                        </Button>
                      </Link>
                    </div>
                  )
                })}
                <div className='mt-2'>
                  <AddWebsiteButton className="w-full" />
                </div>
              </div>
            </div>

            <div className='bottom-4 left-4 right-4 absolute'>
              <Profile />
            </div>
          </aside>
          <div className='col-span-4 lg:col-span-5 overflow-scroll'>
            {props.children}
          </div>
        </div>
      </div>
    </Providers>

  )
}