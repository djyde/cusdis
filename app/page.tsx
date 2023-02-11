import axios from "axios"
import { HomeActions } from "./HomeActions"
import { Inter } from '@next/font/google'
const inter = Inter({
  subsets: ["latin"],
})

type Contributer = {
  MemberId: string,
  createdAt: string,
  role: string,
  profile: string
  image: string,
  name: string,
  website?: string
}
async function getContributers() {
  let contributers: Contributer[] = []
  try {
    contributers = (await axios.get<Contributer[]>('https://opencollective.com/cusdis/members/all.json')).data
  } catch (e) {

  }
  return contributers
}

export default async function Page() {
  // const contributers = await getContributers()
  // console.log(contributers)
  return (
    <div className={inter.className}>
      <section className="mx-auto p-12 flex flex-col gap-4 md:w-[960px] md:pt-36">
        <h1 className="text-2xl font-bold">Cusdis</h1>
        <h2 className="text-5xl font-bold">Privacy-first, open-source comment service</h2>
        <HomeActions />
      </section>
    </div>
  )
}