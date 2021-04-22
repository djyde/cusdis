import React from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Img,
  Link,
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
        <Box width="md" mt={16} boxSizing="border-box">
          <Heading size="2xl">Next comment tool for your website</Heading>
        </Box>
        <Text fontSize="lg" mt={4}>
          <p>
            Open source, lightweight (4.7kb gzip), privacy-friendly alternative
            to Disqus.
          </p>
        </Text>

        <Box mt={8}>
          <Img src="/landing.png" />
        </Box>
      </Container>

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
