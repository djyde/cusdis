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
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Footer } from '../components/Footer'
import { Head } from '../components/Head'
import { getSession, resolvedConfig, sentry } from '../utils.server'
import { GetServerSideProps, Redirect } from 'next'

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
                  colorScheme="telegram"
                >
                  Start for free
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
                Open source, lightweight (5kb gzipped), privacy-friendly alternative
                to Disqus.
          </p>
            </Text>
          </Box>

          <Box>
            <Img src="/images/landing.png" />
          </Box>

        </VStack>

      </Container>

      <Container maxWidth="6xl">
        <Heading mt={24}>
          Easy to integrate
        </Heading>
      </Container>

      <Box my={12} py={12} bgColor="gray.50" width="full" boxShadow="inner">
        <Container maxWidth="6xl">
          <SimpleGrid columns={[1, 2, 4]} spacing={12}>
            <LinkBox>
              <LinkOverlay isExternal href="/doc#/advanced/sdk">
                <Img src="/images/vanilla.png" w={12} mt={6} />
              </LinkOverlay>
            </LinkBox>
            <LinkBox>
              <LinkOverlay isExternal href="https://github.com/Cusdis/sdk/tree/master/packages/react-cusdis">
                <Img src="/images/react.png" w={24} mt={4} />
              </LinkOverlay>
            </LinkBox>
            <LinkBox>
              <LinkOverlay isExternal href="#">
                <Img src="/images/svelte.svg" w={24} mt={8} />
              </LinkOverlay>
            </LinkBox>
            <LinkBox>
              <LinkOverlay isExternal href="/doc#/integration/docsify">
                <Img src="/images/docsify.svg" w={12} mt={6} />
              </LinkOverlay>
            </LinkBox>

            <LinkBox>
              <LinkOverlay isExternal href="http://blog.cusdis.com/hello-world/integate-cusdis-in-hexo/">
                <Img src="/images/hexo.svg" w={12} />
              </LinkOverlay>
            </LinkBox>
          </SimpleGrid>
        </Container>
      </Box>

      <Box mt={24}>
        <Container maxWidth="6xl">
          <Heading mb={12}>
            Features
          </Heading>

          <SimpleGrid columns={3} textAlign="left" spacing={12}>
            <VStack alignItems="start">
              <Heading size="sm">Lightweight</Heading>
              <Box color="gray.500" fontSize="sm">
                The JS SDK embedded to your website is only around <strong>5kb</strong> gzipped.
              </Box>
            </VStack>
            <VStack alignItems="start">
              <Heading size="sm">Email Notification</Heading>
              <Box color="gray.500" fontSize="sm">
                You will receive Email notification when a new comment comes in, and approve the new comment without login.
              </Box>
            </VStack>
            <VStack alignItems="start">
              <Heading size="sm">Import from Disqus</Heading>
              <Box color="gray.500" fontSize="sm">
                One-click to import your existed data in Disqus to Cusdis.
              </Box>
            </VStack>
            <VStack alignItems="start">
              <Heading size="sm">Open source</Heading>
              <Box color="gray.500" fontSize="sm">
                Cusdis is an open-source project. Everyone can sure <strong>we don't track you and your user</strong>. Also, you can deploy your own Cusdis service with ease, to make sure you own your data.
              </Box>
            </VStack>
          </SimpleGrid>

        </Container>
      </Box>

      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> | Redirect = async (ctx) => {
  const session = await getSession(ctx.req)

  if (!resolvedConfig.isHosted) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: {
      session,
    },
  }
}

export default IndexPage
