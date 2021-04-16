import React from 'react'
import { getSession } from 'next-auth/client'

function IndexPage(props: {
  session
}) {
  return (
    <>
      Hello, index page
    </>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx)
  return {
    props: {
      session
    }
  }
}

export default IndexPage