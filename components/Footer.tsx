import { Anchor, Box, Group, List, Stack, Text, Image, Center } from '@mantine/core'
import * as React from 'react'
import { VERSION } from '../utils.client'

export function Footer(props: {
  maxWidth?: string
}) {
  return (
    <Box p={48}>
      <Center>
        <Group spacing={120} align="start">
          <List listStyleType={'none'} color="gray.500" spacing={2}>
            <List.Item mb={8}>
              <Text color="gray.900" weight={500}>Contact</Text>
            </List.Item>
            <List.Item>
              <Anchor target={'_blank'} href="https://twitter.com/cusdis_hq">Twitter</Anchor>
            </List.Item>
            <List.Item>
              <Anchor target="_blank" href="https://blog.cusdis.com">Blog</Anchor>
            </List.Item>
            <List.Item>
              <Anchor target="_blank" href="https://github.com/djyde/cusdis">GitHub</Anchor>
            </List.Item>
            <List.Item>
              <Text>hi@cusdis.com</Text>
            </List.Item>
          </List>
          <List listStyleType={'none'} color="gray.500" spacing={2}>
            <List.Item mb={8}>
              <Text weight={500} color="gray">Resources</Text>
            </List.Item>
            <List.Item>
              <Anchor target="_blank" href="https://cusdis.com/doc">Documentation</Anchor>
            </List.Item>
            <List.Item>
              <Anchor target="_blank" href="https://opencollective.com/cusdis">Sponsor</Anchor>
            </List.Item>
            <List.Item>
              <Anchor target="_blank" href="/privacy-policy">Privacy Policy</Anchor>
            </List.Item>
          </List>

        </Group>
      </Center> 
      <Stack spacing={2} mt={12} align="center">
        <Image width={8} src="/images/artworks/logo-gray-256.png" />
        <Text size="sm" align="right" color="gray.500">
          v{VERSION}
        </Text>
      </Stack>
    </Box>
  )
}
