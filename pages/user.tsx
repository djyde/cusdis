import { Subscription, User } from "@prisma/client"
import { Box, Button, Checkbox, Container, FormControl, FormLabel, Heading, HStack, Input, InputGroup, InputRightAddon, Link, Switch, Text, useToast, VStack } from "@chakra-ui/react"
import React from "react"
import { useMutation } from "react-query"
import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"
import { UserSession } from "../service"
import { apiClient } from "../utils.client"
import { getSession, prisma, resolvedConfig } from "../utils.server"
import { Head } from "../components/Head"
import NextHead from 'next/head'
import dayjs from "dayjs"
import { PaymentService } from "../service/payment.service"

declare var Paddle

// From https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
  if (email === '') {
    return true
  }
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const updateUserSettings = async (params: {
  notificationEmail?: string,
  enableNewCommentNotification?: boolean
}) => {
  const res = await apiClient.put(`/user`, {
    notificationEmail: params.notificationEmail,
    enableNewCommentNotification: params.enableNewCommentNotification
  })
  return res.data
}

function UserPage(props: {
  session: UserSession,
  isLocal: boolean,
  isHosted: boolean,
  isPro: boolean,
  paddle: {
    vendorId?: number,
    plan: {
      pro: number
    }
  },
  defaultUserInfo: DefaultUserInfo
}) {

  const updateNotificationEmailMutation = useMutation(updateUserSettings)
  const updatePreferenceMutation = useMutation(updateUserSettings)

  const toast = useToast()

  const notificationEmailInputRef = React.useRef(null)

  function onClickSaveNotificationEmail() {

    const value = notificationEmailInputRef.current.value

    if (!validateEmail(value)) {
      toast({
        title: 'Email address is not valid',
        status: 'error',
        position: 'top'
      })
      return
    }

    updateNotificationEmailMutation.mutate({
      notificationEmail: value
    }, {
      onSuccess() {
        toast({
          title: 'Updated',
          status: 'success',
          position: 'top'
        })
      },
      onError() {
        toast({
          title: 'Something went wrong',
          status: 'error',
          position: 'top'
        })
      }
    })
  }

  function onCheckNotificationPreference(params) {
    updatePreferenceMutation.mutate(params, {
      onSuccess() {
        toast({
          title: 'Updated',
          status: 'success',
          position: 'top'
        })
      },
      onError() {
        toast({
          title: 'Something went wrong',
          status: 'error',
          position: 'top'
        })
      }
    })
  }

  const UpgradeButton = <Button size="sm" onClick={_ => {
    // @ts-expect-error
    window.Paddle.Checkout.open({
      product: props.paddle.plan.pro,
      email: props.session.user.email,
      passthrough: JSON.stringify({
        userId: props.session.uid
      })
    })
  }}>Upgrade</Button>

  return (
    <>
      <Head title="User Settings" />
      <NextHead>
        {props.paddle && <><script src="https://cdn.paddle.com/paddle/paddle.js"></script>
          <script type="text/javascript">
            {props.isLocal && `Paddle.Environment.set('sandbox');`}
            {`Paddle.Setup({ vendor: ${props.paddle.vendorId} });`}
          </script></>}
      </NextHead>
      <Navbar isPro={props.isPro} session={props.session} />
      <Container maxWidth="5xl" mt={24}>

        <VStack alignItems="flex-start" spacing={12}>
          <Heading>Hi, {props.session.user.name}</Heading>

          <VStack alignItems="flex-start" spacing={4}>
            <Heading size="md">Account</Heading>
            <HStack spacing={4}>

              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input disabled value={props.session.user.name} />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input disabled value={props.session.user.email} />
              </FormControl>
            </HStack>
          </VStack>

          {props.isHosted && <VStack alignItems="flex-start">
            <Heading size="md">Membership</Heading>

            {props.isPro ?
              props.defaultUserInfo.subscription ? <>
                {props.defaultUserInfo.subscription.cancellationEffectiveDate ? <Box>
                  Your subscription will be ended at <Text as="span" fontWeight="medium">{props.defaultUserInfo.subscription.cancellationEffectiveDate}</Text>
                </Box> : <Box>
                  Next bill date: {props.defaultUserInfo.subscription.nextBillDate}
                </Box>}
                <Box>
                  Billing Email: {props.defaultUserInfo.subscription.billingEmail}
                </Box>
                {!props.defaultUserInfo.subscription.cancellationEffectiveDate && <Box>
                  <Link isExternal textDecor="underline" href={props.defaultUserInfo.subscription.cancelUrl}>Cancel</Link>
                </Box>}

                {props.defaultUserInfo.subscription.cancellationEffectiveDate && UpgradeButton}

              </>
                : <>
                  Thank you early adoptor! You are Cusdis Pro until 2021/08/01
              </>
              : <>{UpgradeButton}</>}
          </VStack>}

          <VStack alignItems="flex-start" spacing={4}>
            <Heading size="md">Notification</Heading>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Notification email</FormLabel>
                <HStack spacing={2}>
                  <Input defaultValue={props.defaultUserInfo.notificationEmail || props.defaultUserInfo.email} ref={notificationEmailInputRef} type="email" />
                  <Button px={8} isLoading={updateNotificationEmailMutation.isLoading} onClick={onClickSaveNotificationEmail}>Save</Button>
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Preferences</FormLabel>
                <Checkbox onChange={e => {
                  onCheckNotificationPreference({
                    enableNewCommentNotification: e.target.checked
                  })
                }} defaultChecked={props.defaultUserInfo.enableNewCommentNotification}>New comment notification</Checkbox>
              </FormControl>
            </VStack>
          </VStack>

        </VStack>
      </Container>

      <Footer maxWidth="5xl" />
    </>
  )
}

type DefaultUserInfo = Pick<User, "notificationEmail" | "id" | "email" | "name" | "enableNewCommentNotification"> & {
  subscription: Pick<Subscription, "cancelUrl" | "planId" | "billingEmail" | "nextBillDate" | "cancellationEffectiveDate">
}
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx.req)

  const paymentService = new PaymentService()

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false
      }
    }
  }

  const defaultUserInfo = await prisma.user.findUnique({
    where: {
      id: session.uid
    },
    select: {
      id: true,
      notificationEmail: true,
      enableNewCommentNotification: true,
      name: true,
      email: true,
      subscription: {
        select: {
          cancelUrl: true,
          planId: true,
          billingEmail: true,
          nextBillDate: true,
          cancellationEffectiveDate: true
        }
      }
    }
  }) as DefaultUserInfo

  if (defaultUserInfo.subscription) {
    //@ts-expect-error
    defaultUserInfo.subscription.nextBillDate = dayjs(defaultUserInfo.subscription.nextBillDate).format('YYYY/MM/DD')
  }

  if (defaultUserInfo.subscription?.cancellationEffectiveDate) {
    //@ts-expect-error
    defaultUserInfo.subscription.cancellationEffectiveDate = dayjs(defaultUserInfo.subscription.cancellationEffectiveDate).format('YYYY/MM/DD')
  }

  return {
    props: {
      session,
      defaultUserInfo,
      isLocal: resolvedConfig.isLocal,
      isHosted: resolvedConfig.isHosted,
      isPro: await paymentService.isPro(session.uid),
      paddle: resolvedConfig.paddle.publicKey ? {
        vendorId: resolvedConfig.paddle.vendorId,
        plan: resolvedConfig.paddle.plan
      } : null
    }
  }
}

export default UserPage