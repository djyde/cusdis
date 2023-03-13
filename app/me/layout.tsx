import { Providers } from "../utils/providers";

export default function Layout (props) {
  return (
    <Providers>
      {props.children}
    </Providers>
  )
}