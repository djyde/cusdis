import { Nav } from "./Nav";

export default function Layout({
  children
}) {
  return (
    <>
      <Nav />
      <div>
        {children}
      </div>
    </>
  )
}