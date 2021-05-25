import { Link, VStack, Text } from '@chakra-ui/layout'
import * as React from 'react'

export function UpgradeToastBody (props: {
  msg: string
}) {  
  return (
    <>
      <VStack alignItems="start">
        <Text>{props.msg}</Text>
        <Link fontWeight="bold" href="/user">Upgrade</Link>
      </VStack>
    </>
  )
}
