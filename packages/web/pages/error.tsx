import { Text } from "@chakra-ui/layout"

export enum ErrorCode {
  INVALID_TOKEN = 'INVALID_TOKEN'
}

function ErrorPage({
  errorCode
}: {
  errorCode: ErrorCode | null
}) {

  const info = (() => {
    switch (errorCode) {
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

export async function getServerSideProps(ctx) {
  return {
    props: {
      errorCode: ctx.query.code || null
    }
  }
}

export default ErrorPage