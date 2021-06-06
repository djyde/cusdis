import React from 'react'
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Icon,
  Image,
  Img,
  Link,
  LinkBox,
  LinkOverlay,
  List,
  ListItem,
  SimpleGrid,
  Spacer,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Footer } from '../components/Footer'
import { Head } from '../components/Head'
import { getSession, resolvedConfig, sentry } from '../utils.server'
import { GetServerSideProps, Redirect } from 'next'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { GoMarkGithub } from "react-icons/go";
import axios from 'axios'
import { UserSession } from '../service'
import NextHead from 'next/head'

type Props = {
  session: UserSession
  contributers: Contributer[]
}

type Contributer = {
  MemberId: string,
  createdAt: string,
  role: string,
  profile: string
  image: string,
  name: string,
  website?: string
}

function IndexPage({ session, contributers }: Props) {
  const router = useRouter()

  const StartButton = session ? (
    <Button
      rightIcon={<ArrowForwardIcon />}
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
  )

  return (
    <Box className="font">
      <Head title="Cusdis - Lightweight, privacy-first, open-source comment system" />
      <NextHead>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
      </NextHead>
      <Box as="nav" py={4} mt={[2, 24]} mb={12}>
        <Container maxWidth="3xl">
          <HStack>
            <Image w={12} src="/images/artworks/logo-256.png" />
            <Text className="font" fontWeight="bold" fontSize="2xl">
              Cusdis
            </Text>
            <Spacer />
            <Box display={['none', 'initial']}>
              <HStack>

              </HStack>
            </Box>


            {/* 
            <Link
              isExternal
              href="https://github.com/djyde/cusdis"
              fontWeight="bold"
              color="gray.700"
            >
              GitHub
          </Link> */}

          </HStack>
        </Container>
      </Box>

      <Container maxWidth="3xl">
        <VStack alignItems="start" spacing={16}>
          <Box>
            <Box mt={16} boxSizing="border-box" className="font">
              <Heading as="h1" size="4xl" fontSize={['5xl', '7xl']}><Text color="#014f86" as="span">Lightweight</Text>, <Text color="#2c7da0" as="span">privacy-first</Text>,  <Text color="#1b263b" as="span">open-source</Text> comment system</Heading>
            </Box>
            <Text fontSize="lg" mt={8} color="gray.700" className="font">
              <strong>Cusdis</strong> is an open-source, lightweight (~5kb gzipped), privacy-first <strong>alternative to Disqus</strong>. It's super easy to use and integrate with your existed website. We don't track you and your user.
            </Text>

            <HStack mt={12} spacing={4}>
              {StartButton}

              <Link fontWeight="medium" isExternal href="/doc">
                Documentation
              </Link>
            </HStack>
          </Box>

          <Box mt={24}>
            <Container maxWidth="3xl">
              <SimpleGrid columns={[1, 2, 2]} textAlign="left" spacing={12} spacingY={24}>
                <VStack alignItems="start">
                  <Img shadow="base" mb={2} src="/images/intro-widget.png" />
                  <Heading size="sm">Lightweight</Heading>
                  <Box color="gray.500" fontSize="sm">
                    The <Link textDecoration='underline' href="/doc#/advanced/sdk">JS SDK</Link> embedded to your website is only around <strong>5kb</strong> (gzipped). It has built-in i18n, dark-mode.
              </Box>
                </VStack>

                <VStack alignItems="start">
                  <Img shadow="base" mb={2} src="/images/intro-dashboard.png" />
                  <Heading size="sm">Dashboard</Heading>
                  <Box color="gray.500" fontSize="sm">
                    Moderate all the comments on a dashboard.
              </Box>
                </VStack>

                <VStack alignItems="start">
                  <Img shadow="base" mb={2} src="/images/intro-email.png" />
                  <Heading size="sm">Email Notification</Heading>
                  <Box color="gray.500" fontSize="sm">
                    You will receive Email notification when a new comment comes in, and approve the new comment without login.
              </Box>
                </VStack>

                <VStack alignItems="start">
                  <Img shadow="base" mb={2} src="/images/intro-bot.png" />
                  <Heading size="sm">Webhook</Heading>
                  <VStack color="gray.500" fontSize="sm" alignItems="start">
                    <Text>You can set a Webhook URL that will be triggered when your websites have new comment. Integrate Cusdis with your favorite tools such as Telegram.</Text>
                    <Link href="/doc#/advanced/webhook" isExternal textDecoration="underline">How to use Webhook</Link>
                  </VStack>
                </VStack>

                <VStack alignItems="start">
                  <Img shadow="base" mb={2} src="/images/intro-approval.png" />
                  <Heading size="sm">Approve/Reply without login</Heading>
                  <Box color="gray.500" fontSize="sm">
                    In the notification email and webhook, you will get a short-time link to approve/reply the new comment without login to dashboard. All the things get done in your mobile.
              </Box>
                </VStack>

                <VStack>

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
                  <Box pt={2}>
                    <Link href="https://github.com/djyde/cusdis" isExternal>
                      <Icon w={8} h={8} as={GoMarkGithub} />
                    </Link>
                  </Box>
                </VStack>
              </SimpleGrid>

            </Container>
          </Box>


        </VStack>

      </Container>



      <Container maxWidth="3xl">
        <Heading mt={48} mb={12} letterSpacing="wider" color="gray.500" fontSize="md" textAlign="center">
          Integrate with frameworks and platforms with ease
        </Heading>
      </Container>

      <Box width="full">
        <Container maxWidth="3xl">
          <SimpleGrid columns={[2, 2, 4]} spacingY={12}>
            <LinkBox>
              <LinkOverlay isExternal href="/doc#/advanced/sdk">
                <Center>
                  <Img src="/images/vanilla.png" w={12} mt={6} />
                </Center>
              </LinkOverlay>
            </LinkBox>
            <LinkBox>
              <LinkOverlay isExternal href="https://github.com/Cusdis/sdk/tree/master/packages/react-cusdis">
                <Center>
                  <Img src="/images/react.png" w={24} mt={4} />
                </Center>
              </LinkOverlay>
            </LinkBox>
            <LinkBox>
              <LinkOverlay isExternal href="https://github.com/evillt/vue-cusdis">
                <Center>
                  <Img src="/images/vue.png" w={12} mt={8} />
                </Center>
              </LinkOverlay>
            </LinkBox>
            <LinkBox>
              <LinkOverlay isExternal href="#">
                <Center>
                  <Img src="/images/svelte.svg" w={24} mt={8} />
                </Center>
              </LinkOverlay>
            </LinkBox>
            <LinkBox>
              <LinkOverlay isExternal href="/doc#/integration/docsify">
                <Center>
                  <Img src="/images/docsify.svg" w={12} mt={6} />
                </Center>
              </LinkOverlay>
            </LinkBox>

            <LinkBox>
              <LinkOverlay isExternal href="http://blog.cusdis.com/integate-cusdis-in-hexo/">
                <Center>
                  <Img src="/images/hexo.svg" w={12} mt={4} />
                </Center>
              </LinkOverlay>
            </LinkBox>
          </SimpleGrid>
        </Container>
      </Box>



      <Container maxW="3xl">
        <Box mt={48}>
          <Heading mb={12} textAlign="center">
            Pricing
            </Heading>

          <Center>
            <SimpleGrid columns={[1, 2]} spacing={8}>
              <VStack border="1px solid" borderColor="gray.200" py={6} rounded="lg">
                <Heading size="xl" textAlign="center">$0</Heading>
                <Box px={6} pb={3}>
                  <Text fontSize="sm" color="gray.500">
                    Free
                    </Text>
                </Box>

                <Box w="full" borderTop="1px solid" borderColor="gray.200" p={6}>
                  <List fontSize="sm" spacing={2}>
                    <ListItem>
                      <strong>3</strong> Websites
                    </ListItem>
                    <ListItem>
                      Email Notification
                    </ListItem>
                  </List>
                </Box>
              </VStack>
              <VStack border="1px solid" borderColor="gray.200" py={6} rounded="lg">
                <Heading size="xl" textAlign="center"><del>$1</del> <Text as="span" fontSize="sm">/month</Text></Heading>
                <Box px={6} pb={3}>
                  <Text fontSize="sm" color="gray.500">
                    Cusdis is totally free for now.
                  </Text>
                </Box>

                <Box w="full" borderTop="1px solid" borderColor="gray.200" p={6}>
                  <List fontSize="sm" spacing={2}>
                    <ListItem>
                      <strong>Unlimited</strong> Websites
                    </ListItem>
                    <ListItem>
                      Email Notification
                    </ListItem>
                    <ListItem>
                      Webhook
                    </ListItem>
                    <ListItem>
                      Spam filter (coming soon)
                      </ListItem>
                  </List>
                </Box>
              </VStack>
            </SimpleGrid>

          </Center>

          <VStack alignItems="start">
            <Text fontSize="sm" mt={12} color="gray.500">
              * We are not making money yet. Users sign up before we launch our paid plans will get three-months paid membership after the plans launch.
            </Text>

            <Text fontSize="sm" mt={12} color="gray.500">
              * If you like Cusdis. Consider <Link fontWeight="medium" textDecoration="underline" href="https://opencollective.com/cusdis" isExternal>sponsor us</Link> to help us be sustainable.
              </Text>

            <Text fontSize="sm" mt={12} color="gray.500">
              * Special thanks to these sponsors
              </Text>
            <UnorderedList spacing={1} pl={6} fontSize="sm" mt={12} color="gray.500">
              {contributers.map(contributer => {
                return (
                  <ListItem key={contributer.MemberId}>
                    <Link href={contributer.website || contributer.profile} fontSize="sm">{contributer.name}</Link>

                  </ListItem>
                )
              })}
            </UnorderedList>
          </VStack>

        </Box>

      </Container>


      <Box mt={24} textAlign="center">
        {StartButton}
      </Box>

      <Footer maxWidth="3xl" />
    </Box>
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

  let contributers = [] as Contributer[]

  try {
    contributers = (await axios.get<Contributer[]>('https://opencollective.com/cusdis/members/all.json')).data
  } catch (e) {

  }

  return {
    props: {
      session,
      contributers: contributers.filter(_ => _.role !== 'HOST' && _.role !== 'ADMIN')
    },
  }
}

export default IndexPage
