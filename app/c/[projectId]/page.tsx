import { en } from "../lang/en"

export default async function Page(props) {
  const slug = props.searchParams.slug
  const locale = en

  return (
    <div className="p-2">
      <textarea placeholder={locale.reply_placeholder} className="w-full border-gray-200 border-2 rounded p-1"></textarea>
    </div>
  )
}