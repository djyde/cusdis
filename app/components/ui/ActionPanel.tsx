import React, { ReactNode } from "react"

export function ActionPannel(props: {
  title: ReactNode
  body?: ReactNode
  description?: ReactNode
  actions?: ReactNode
}) {

  // let title: typeof Title | null = null
  // let actions: typeof Actions | null = null
  // React.Children.forEach(props.children, c => {
  //   switch (c.type) {
  //     case Title:
  //       title = c
  //       break;
  //     case Actions:
  //       actions = c
  //       break;
  //   }
  // })

  return (
    <>
      <div className="p-6 border-t border-l border-r rounded-t flex flex-col gap-4">
        <h3 className="text-lg font-bold">{props.title}</h3>
        <div className="text-sm">
          {props.description}
        </div>
        <div>
          {props.body}
        </div>
      </div>
      <div className="border p-6 py-4 rounded-b bg-gray-50">
        {props.actions}
      </div>
    </>
  )
}

