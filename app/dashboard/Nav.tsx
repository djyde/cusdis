import { ProfileButton } from "./ProfileButton"

export const Nav = function () {
  return (
    <nav className="p-12 flex gap-4">
      <div className="font-bold">
        Cusdis
      </div>
      <div>
        <ProfileButton />
      </div>
    </nav>
  )
}