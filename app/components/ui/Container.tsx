export function Container(props: {
  children: React.ReactNode,
  className?: string
}) {
  return (
    <div className={`mx-auto md:w-[960px] ${props.className}`}>
      {props.children}
    </div>
  )
}