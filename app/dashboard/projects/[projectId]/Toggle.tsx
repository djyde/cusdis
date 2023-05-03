'use client'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { useRouter } from 'next/navigation'

export function Toggle(props: {
  projectId: string
}) {
  const router = useRouter()
  const rootClass = 'flex gap-1 text-xs items-center border border-slate-100 rounded'
  const itemClass = 'data-[state=on]:bg-gray-800 data-[state=on]:text-white px-2 py-1 rounded m-1 first:mr-0 last:ml-0 font-medium hover:bg-slate-100 transition-colors'
  return (
    <div>
      <ToggleGroup.Root className={rootClass} type="single" onValueChange={value => {
        switch (value) {
          case 'overview':
            router.replace(`/dashboard/projects/${props.projectId}`)
            break;
          case 'comments':
            router.replace(`/dashboard/projects/${props.projectId}/comments`)
            break;
        }
      }}>
        <ToggleGroup.Item className={itemClass} value="overview">Overview</ToggleGroup.Item>
        <ToggleGroup.Item className={itemClass} value="comments">Comments</ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  )
}