import { Providers } from "../Providers";

export default function Layout({
  children
}) {
  return (
    <Providers>
      {children}
    </Providers>
  )
}