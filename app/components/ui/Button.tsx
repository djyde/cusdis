import classnames from 'classnames'
import { noop } from '../../utils'
export const Button = (props: {
  className?: string,
  onClick?: () => void,
  href?: string,
  isLoading?: boolean
  children: any,
  variant?: 'primary' | 'default'
}) => {
  const variant = props.variant || 'default'

  const classNames = classnames("rounded-full px-4 py-1 font-medium cursor-pointer hover:bg-gray-100 hover:text-gray-900 transition-colors", {
    'text-gray-900 border-black border-2 hover:bg-black hover:text-gray-100 transition-colors': variant === 'default',
    'border-black border-2 bg-black text-gray-100': variant === 'primary'
  }, props.className)

  if (props.href) {
    return (
      <a href={props.href} className={classNames} >{props.isLoading ? 'Loading' : props.children}</a>
    )
  }

  return (
    <button disabled={!!props.isLoading} type="button" onClick={props.onClick || noop} className={classNames} >{props.isLoading ? 'Loading' : props.children}</button>
  )
}