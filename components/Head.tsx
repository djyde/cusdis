import * as React from 'react'
import NextHead from 'next/head'

export function Head (props: {
  title: string
}) {
  return (
    <>
      <NextHead>
        <title>
          {props.title} - Next comment tool for your website
        </title>
      </NextHead>
    </>
  )
}