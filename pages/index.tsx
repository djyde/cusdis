import React from 'react'
import { signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Footer } from '../components/Footer'
import { Head } from '../components/Head'
import { getSession, resolvedConfig, sentry } from '../utils.server'
import { GetServerSideProps, Redirect } from 'next'
import axios from 'axios'
import { UserSession } from '../service'
import NextHead from 'next/head'
import { Button, Container, Group, Stack, Text, Title, Box, Anchor, Grid, Center, Image, List, Badge, Flex } from '@mantine/core'
import { AiOutlineArrowRight, AiOutlineRight } from 'react-icons/ai'
import { usageLimitation } from '../config.common'

type Props = {
  session: UserSession
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

const integrations = [
  {
    label: 'Vanilla JS',
    image: '/images/vanilla.png',
    imageWidth: 48,
    link: ''
  },
  {
    label: 'Vue',
    image: '/images/vue.png',
    imageWidth: 48,
    link: 'https://github.com/evillt/vue-cusdis'
  },
  {
    label: 'React',
    image: '/images/react.png',
    imageWidth: 80,
    link: 'https://github.com/Cusdis/sdk/tree/master/packages/react-cusdis'
  },
  {
    label: 'Svelte',
    image: '/images/svelte.svg',
    imageWidth: 96,
    link: '#'
  },
  {
    label: 'Docsify',
    image: '/images/docsify.svg',
    imageWidth: 48,
    link: '/doc#/integration/docsify'
  },
  {
    label: 'Hexo',
    image: '/images/hexo.svg',
    imageWidth: 48,
    link: 'http://blog.cusdis.com/integate-cusdis-in-hexo/'
  }
]

function IndexPage({ session }: Props) {
  const router = useRouter()

  const StartButton = session ? (
    <Button
      rightIcon={<AiOutlineArrowRight />}
      onClick={() => router.push('/dashboard')}
      color="gray.700"
    >
      Dashboard
    </Button>
  ) : (
    <Button
      onClick={() =>
        signIn(null, { callbackUrl: `${location.origin}/dashboard` })
      }
    >
      Start for free
    </Button>
  )

  return (
    <Box className="">
      <Head title="Cusdis - Lightweight, privacy-first, open-source comment system" />
      <NextHead>
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" /> */}
      </NextHead>
      <Container mt={120}>
        <Stack spacing={48}>
          <Stack>
            <Box component='h1' sx={theme => ({
              lineHeight: 1.1,
              fontSize: 62,
              fontWeight: 800,
              margin: 0
            })}>
              A <Text variant={'gradient'} gradient={{ from: "blue", to: "cyan" }} component="span" inherit>lightweight, privacy-first, open-source</Text> comment system
              {/* <Text>for your blog</Text> */}
            </Box>
            <Text color="gray">
              <strong>Cusdis</strong> is an open-source, lightweight, privacy-first <strong>alternative to Disqus</strong>. It's super easy to use and integrate with your existing website. We don't track you and your users.
            </Text>
          </Stack>
          <Center>
            <Stack mt={12}>
              <Group spacing={24}>
                {StartButton}

                <Button variant={'outline'} component='a' target={'_blank'} href="/doc">
                  Documentation
                </Button>

                <Anchor href="#pricing" weight={500}>Pricing</Anchor>

                {/* <Anchor weight={500}>Pricing</Anchor> */}
              </Group>
            </Stack>
          </Center>

          <Stack mt={24}>
            <Image src="/images/intro-dashboard-2.png" />
          </Stack>

          <Title order={1} my={96} align='center'>Features</Title>

          <Grid gutter={64}>
            <Grid.Col span={6}>
              <Stack>
                <Image src="/images/intro-widget.png" w="100%" />
                <Stack spacing={8}>
                  <Title order={4}>
                    Lightweight
                  </Title>
                  <Text>
                    The JS SDK embedded to your website is only around 5kb (gzipped). It has built-in i18n, dark-mode.
                  </Text>
                </Stack>
              </Stack>
            </Grid.Col>

            <Grid.Col span={6}>
              <Stack>
                <Image src="/images/intro-email.png" w="100%" />
                <Stack spacing={8}>
                  <Title order={4}>
                    Email Notification
                  </Title>
                  <Text>
                    You will receive Email notification when a new comment comes in, and do a Quick Approve.
                  </Text>
                </Stack>
              </Stack>
            </Grid.Col>

            <Grid.Col span={6}>
              <Stack>
                <Image src="/images/intro-approval.png" w="100%" />
                <Stack spacing={8}>
                  <Title order={4}>
                    Quick Approve
                  </Title>
                  <Text>
                    In the notification email and webhook, you will get a short-time link to approve/reply the new comment without login to dashboard. All the things get done in your mobile.
                  </Text>
                </Stack>
              </Stack>
            </Grid.Col>

            <Grid.Col span={6}>
              <Stack>
                <Image src="/images/intro-bot.png" w="100%" />
                <Stack spacing={8}>
                  <Title order={4}>
                    Webhook
                  </Title>
                  <Text>
                    You can set a Webhook URL that will be triggered when your websites have new comment. Integrate Cusdis with your favorite tools such as Telegram.
                  </Text>
                  <Anchor href="/doc#/advanced/webhook" sx={{
                    textDecoration: 'underline'
                  }}>How to use Webhook</Anchor>
                </Stack>
              </Stack>
            </Grid.Col>

          </Grid>

          <Title order={1} align='center' my={96}>
            Integrate with frameworks and platforms with ease
          </Title>
        </Stack>
      </Container>

      <Stack mt={48} sx={theme => ({
        boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        backgroundColor: theme.colors.gray[0],
        paddingTop: 80
      })}>
        <Grid gutter={'xl'}>
          {integrations.map(item => {
            return (
              <Grid.Col mb={48} key={item.label} span={2}>
                <Stack align={'center'} justify='space-between'>
                  <Anchor href={item.link}>
                    <Image src={item.image} width={item.imageWidth} />
                  </Anchor>
                </Stack>
              </Grid.Col>
            )
          })}
        </Grid>

      </Stack>

      <Box>
        <Title id="pricing" order={1} align='center' my={96}>Pricing</Title>
        <Flex
          gap="lg"
          justify={'center'}
        >
          <Stack sx={{
            border: '1px solid #eee',
            padding: 24,
            borderRadius: 12
          }} >
            <Title order={3}>Self Host</Title>
            <Box>
              <Badge>FREE</Badge>
            </Box>
            <List listStyleType={'none'} sx={{
            }} size="sm">
              <List.Item>All features. But host on your own server and database.</List.Item>
            </List>
            <Button component="a" href="/doc" target={'_blank'}>Documentation</Button>
          </Stack>

          <Stack sx={{
            border: '1px solid #eee',
            padding: 24,
            borderRadius: 12
          }}>
            <Title order={3}>Cloud</Title>
            <Box>
              <Badge>FREE</Badge>
            </Box>
            <List sx={{
            }} size="sm">
              <List.Item>{usageLimitation['create_site']} site</List.Item>
              <List.Item>{usageLimitation['approve_comment']} approved comments / month</List.Item>
              <List.Item>{usageLimitation['quick_approve']} Quick Approve / month</List.Item>
            </List>
            <Button component="a" href="/dashboard" target={'_blank'}>Start for free</Button>
          </Stack>

          <Stack sx={{
            border: '1px solid #eee',
            padding: 24,
            borderRadius: 12
          }}>
            <Title order={3}>Cloud Pro</Title>
            <Box>
              <Badge>$12 / year</Badge>
            </Box>
            <List sx={{
            }} size="sm">
              <List.Item>Unlimited sites</List.Item>
              <List.Item>Unlimited approved comments</List.Item>
              <List.Item>Unlimited Quick Approve</List.Item>
            </List>
            <Button component="a" href="/dashboard" target={'_blank'}>Start for free</Button>
          </Stack>
        </Flex>
      </Box>

      <Box my={96}>
        <Footer maxWidth="3xl" />
      </Box>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps<Props> | Redirect = async (ctx) => {
  const session = await getSession(ctx.req)

  if (!resolvedConfig.isHosted && !session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

  let contributers = [] as Contributer[]

  return {
    props: {
      session,
    },
  }
}

export default IndexPage
