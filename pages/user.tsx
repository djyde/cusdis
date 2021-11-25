import { User } from "@prisma/client"
import { Box, Button, Checkbox, Container, FormControl, FormLabel, Heading, HStack, Input, InputGroup, InputRightAddon, InputRightElement, Switch, useToast, VStack } from "@chakra-ui/react"
import React from "react"
import { useMutation } from "react-query"
import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"
import { UserSession } from "../service"
import { apiClient } from "../utils.client"
import { getSession, prisma } from "../utils.server"
import { Head } from "../components/Head"
import { MainLayout } from "../components/Layout"


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
  enableNewCommentNotification?: boolean,
  displayName?: string,
}) => {
  const res = await apiClient.put(`/user`, {
    displayName: params.displayName,
    notificationEmail: params.notificationEmail,
    enableNewCommentNotification: params.enableNewCommentNotification
  })
  return res.data
}

function UserPage(props: {
  session: UserSession,
  defaultUserInfo: DefaultUserInfo
}) {

  const updateNotificationEmailMutation = useMutation(updateUserSettings)
  const updatePreferenceMutation = useMutation(updateUserSettings)
  const updateDisplayNameMutation = useMutation(updateUserSettings)

  const toast = useToast()

  const notificationEmailInputRef = React.useRef<HTMLInputElement>(null)
  const displayNameInputRef = React.useRef<HTMLInputElement>(null)

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

  return (
    <>
      <MainLayout session={props.session}>

        <VStack alignItems="flex-start" spacing={12}>
          <Heading size="md">Settings</Heading>

          <VStack alignItems="flex-start" spacing={4}>
            <Heading size="md">Account</Heading>
            <HStack spacing={4}>

              <FormControl>
                <FormLabel fontSize="sm">Username</FormLabel>
                <Input disabled value={props.session.user.name} />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm">Email</FormLabel>
                <Input disabled value={props.session.user.email} />
              </FormControl>
            </HStack>

            <HStack spacing={4}>

              <FormControl>
                <FormLabel fontSize="sm">Display Name</FormLabel>
                <InputGroup size="md">
                  <Input ref={displayNameInputRef} defaultValue={props.defaultUserInfo.displayName || props.session.user.name} />

                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" isLoading={updateDisplayNameMutation.isLoading} onClick={
                      _ => void updateDisplayNameMutation.mutate({ displayName: displayNameInputRef.current.value }, {
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
                    }>
                      Save
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </HStack>

          </VStack>

          <VStack alignItems="flex-start" spacing={4}>
            <Heading size="md">Notification</Heading>
            <VStack spacing={8}>

              <FormControl>
                <FormLabel>Preferences</FormLabel>
                <Checkbox onChange={e => {
                  onCheckNotificationPreference({
                    enableNewCommentNotification: e.target.checked
                  })
                }} defaultChecked={props.defaultUserInfo.enableNewCommentNotification}>Enable new comment notification</Checkbox>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm"> Notification email</FormLabel>
                <HStack spacing={2}>
                  <InputGroup size="md">
                    <Input defaultValue={props.defaultUserInfo.notificationEmail || props.defaultUserInfo.email} ref={notificationEmailInputRef} type="email" />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" isLoading={updateNotificationEmailMutation.isLoading} onClick={onClickSaveNotificationEmail}>Save</Button>
                    </InputRightElement>
                  </InputGroup>
                </HStack>
              </FormControl>

            </VStack>
          </VStack>

        </VStack>

        {/* <Footer maxWidth="5xl" /> */}
      </MainLayout>

    </>
  )
}

type DefaultUserInfo = Pick<User, "notificationEmail" | "email" | "name" | "enableNewCommentNotification" | "displayName">
export async function getServerSideProps(ctx) {
  const session = await getSession(ctx.req)

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
      notificationEmail: true,
      enableNewCommentNotification: true,
      name: true,
      email: true,
      displayName: true
    }
  }) as DefaultUserInfo

  return {
    props: {
      session,
      defaultUserInfo
    }
  }
}

export default UserPage