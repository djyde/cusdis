import classNames from "classnames";

export function Input(props: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <input {...props} className={classNames(props.className, "border rounded px-2 py-1 hover:border-gray-900 transition-colors")} />
  )
}