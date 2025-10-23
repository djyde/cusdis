import { Text } from '@mantine/core'

export enum ErrorCode {
  INVALID_TOKEN = 'INVALID_TOKEN'
}

export default function ErrorPage({
  searchParams
}: {
  searchParams: { code?: ErrorCode }
}) {

  const info = (() => {
    switch (searchParams.code) {
      case ErrorCode.INVALID_TOKEN:
        return <Text>Invalid Token</Text>
      default:
        return <Text>Something went wrong</Text>
    }
  })()

  return (
    <>
      {info}
    </>
  )
}

