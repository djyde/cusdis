import classNames from "classnames";

export function Badge(props: JSX.IntrinsicElements['span'] & {
  color?: string
}) {
  return (
    <span {...props} className={classNames(props.className, 'text-sm font-medium')}>{props.children}</span>
  )
}