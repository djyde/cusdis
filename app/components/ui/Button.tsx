import classnames from 'classnames'
export const Button = (props: {
  href: string,
  children: any,
  variant?: 'primary' | 'default'
}) => {
  const variant = props.variant || 'default'

  return (
    <a className={classnames("rounded-full px-4 py-1 font-medium", {
      'text-gray-900 border-black border-2 hover:bg-black hover:text-gray-100 transition-colors': variant === 'default',
      'border-black border-2 bg-black text-gray-100': variant === 'primary'
    })} href={props.href}>{props.children}</a>
  )
}