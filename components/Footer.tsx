import { Box, Link, Text } from '@chakra-ui/react'
import * as React from 'react'

export function Footer () {
  return (
    <>
      <Box textAlign="center" my={32} fontSize="sm">
        <Text>Made with ❤️ by <Link href="https://twitter.com/randyloop">Randy</Link></Text>
      </Box>
    </>
  )
}
