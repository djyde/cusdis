'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button, Center, Group, Stack } from '@mantine/core'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { UserSession } from '../service'
import { Anchor } from '@mantine/core'

type Props = {
  session: UserSession | null
}

export default function HomeContent({ session }: Props) {
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
        signIn(undefined, { callbackUrl: `${location.origin}/dashboard` })
      }
    >
      Start for free
    </Button>
  )

  return (
    <Center>
      <Stack mt={12}>
        <Group spacing={24}>
          {StartButton}

          <Button variant={'outline'} component='a' target={'_blank'} href="/doc">
            Documentation
          </Button>

          <Anchor href="#pricing" weight={500}>Pricing</Anchor>
        </Group>
      </Stack>
    </Center>
  )
}

