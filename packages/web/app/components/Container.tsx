import cn from 'classnames'

export function Container(props: {
  children,
  className?: string
}) {
  return (
    <div className={cn([
    ], props.className)}>
      {props.children}
    </div>
  )
}