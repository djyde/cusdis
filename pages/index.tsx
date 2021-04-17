import React from 'react'
import { getSession } from 'next-auth/client'
import { Box, Button, Container, Flex, Heading, Img, Link, Spacer, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Footer } from '../components/Footer'
import { Head } from '../components/Head'

function IndexPage(props: {
  session
}) {
  const router = useRouter()

  return (
    <>
      <Head title="Cusdis" />
      <Box as="nav" py={4}>
        <Container maxWidth="6xl">
          <Flex>
            <Text fontWeight="bold" fontSize="2xl">Cusdis</Text>
            <Spacer />
            {/* <VStack>
              <Button fontWeight="bold" color="gray.700">Start for free</Button>
            </VStack> */}
          </Flex>
        </Container>
      </Box>

      <Container maxWidth="6xl">
        <Box width="md" mt={16} boxSizing="border-box">

          <Heading size="2xl">Next comment tool for your website</Heading>
        </Box>
        <Text fontSize="lg" mt={4}>
          <p>Open source, lightweight (4.7kb gzip), privacy-friendly alternative to Disqus.</p>
        </Text>

        <Flex gridGap={4} mt={8}>
          <Button onClick={_ => router.push('/dashboard')} fontWeight="bold" color="gray.700">Start for free</Button>

          <Button variant="link" fontWeight="bold" color="gray.700">Self host guide</Button>
        </Flex>

            {/* <Img src="/discussion.png" /> */}
      </Container>

      <Footer />

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