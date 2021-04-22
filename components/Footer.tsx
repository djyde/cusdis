import { Box, Container, HStack, Link, List, ListItem, Text, VStack } from '@chakra-ui/react'
import * as React from 'react'

export function Footer(props: {
  maxWidth?: string
}) {
  return (
    <>
      <Box borderTopWidth={1} borderTopColor="gray.100" py={12} mt={24}>
        <Container maxWidth={props.maxWidth || '6xl'}>
          <HStack alignItems="stretch" spacing={24}>
            <Box fontSize="sm">
              <List color="gray.500" spacing={2}>
                <ListItem>
                  <Text color="gray.900" fontWeight="medium">Contact</Text>
                </ListItem>
                <ListItem>
                  <Link isExternal href="https://twitter.com/cusdis_hq">Twitter</Link>
                </ListItem>
                <ListItem>
                  <Link isExternal href="https://blog.cusdis.com">Blog</Link>
                </ListItem>
                <ListItem>
                  <Link isExternal href="https://github.com/djyde/cusdis">GitHub</Link>
                </ListItem>
                <ListItem>
                  <Text>hi@cusdis.com</Text>
                </ListItem>

              </List>
              {/* <Text>Made with ❤️ by <Link href="https://twitter.com/randyloop">Randy</Link></Text> */}
            </Box>

            <Box fontSize="sm">
              <List color="gray.500" spacing={2}>
                <ListItem>
                  <Text fontWeight="medium" color="gray.900" >Resources</Text>
                </ListItem>
                <ListItem>
                  <Link isExternal href="https://cusdis.com/doc">Documentation</Link>
                </ListItem>
              </List>
            </Box>
          </HStack>

        </Container>
      </Box>

    </>
  )
}
