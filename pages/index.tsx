import React from 'react'
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  Img,
  Link,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Footer } from '../components/Footer'
import { Head } from '../components/Head'
import { getSession } from '../utils.server'
import { GetServerSideProps } from 'next'

type Props = {
  session: any
}

function IndexPage({ session }: Props) {
  const router = useRouter()

  return (
    <>
      <Head title="Cusdis" />
      <Box as="nav" py={4}>
        <Container maxWidth="6xl">
          <HStack>
            <Text fontWeight="bold" fontSize="2xl">
              Cusdis
            </Text>
            <Spacer />
            <HStack spacing={4} mt={8}>
              {session ? (
                <Button
                  onClick={() => router.push('/dashboard')}
                  fontWeight="bold"
                  color="gray.700"
                >
                  Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    signIn(null, { callbackUrl: `${location.origin}/dashboard` })
                  }
                  fontWeight="bold"
                  color="gray.700"
                >
                  Try it now
                </Button>
              )}

              <Link href="/doc" fontWeight="bold" color="gray.700">
                Documentation
          </Link>

              <Link
                isExternal
                href="https://github.com/djyde/cusdis"
                fontWeight="bold"
                color="gray.700"
              >
                GitHub
          </Link>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Container maxWidth="6xl">
        <VStack alignItems="start" spacing={16}>
          <Box>
            <Box width="md" mt={16} boxSizing="border-box">
              <Heading size="2xl">Next comment tool for your website</Heading>
            </Box>
            <Text fontSize="lg" mt={4}>
              <p>
                Open source, lightweight (4.7kb gzip), privacy-friendly alternative
                to Disqus.
          </p>
            </Text>
          </Box>

          <Box>
            <Img src="/images/landing.png" />
          </Box>

        </VStack>

      </Container>

      <Box my={12} py={24} bgColor="gray.50" width="full">
        <Container maxWidth="6xl">
          <Text color="gray.500" mb={12}>Embed in any websites</Text>
          <HStack spacing={36}>
            <LinkBox>
              <LinkOverlay href="/doc#/advanced/sdk">
                <Img src="/images/vanilla.png" p={5} w={24} />
              </LinkOverlay>
            </LinkBox>
            <LinkBox>
              <LinkOverlay href="https://github.com/Cusdis/sdk/tree/master/packages/react-cusdis">
                <Img src="/images/react.png" w={24} />

              </LinkOverlay>
            </LinkBox>
            <LinkBox>
              <LinkOverlay href="#">
                <Img src="/images/svelte.svg" w={24} />
              </LinkOverlay>
            </LinkBox>
            <LinkBox>
              <LinkOverlay href="/doc#/integration/docsify">
                <Img src="/images/docsify.svg" w={24} p={4} />

              </LinkOverlay>
            </LinkBox>
          </HStack>
        </Container>
      </Box>


      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const session = await getSession(ctx.req)
  return {
    props: {
      session,
    },
  }
}

export default IndexPage
