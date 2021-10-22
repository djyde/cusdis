import { User } from "@prisma/client"
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Text, Box, Button, Checkbox, Container, FormControl, FormLabel, Heading, HStack, Input, InputGroup, InputRightAddon, Switch, useToast, VStack } from "@chakra-ui/react"
import React from "react"
import { signOut } from "next-auth/client"
import { useMutation } from "react-query"
import { Footer } from "../components/Footer"
import { Navbar } from "../components/Navbar"
import { UserSession } from "../service"
import { apiClient } from "../utils.client"
import { getSession, prisma } from "../utils.server"
import { Head } from "../components/Head"


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

const deleteAccount = async () => {
  const res = await apiClient.delete(`/user`)
  return res.data
}

function UserPage(props: {
  session: UserSession,
  defaultUserInfo: DefaultUserInfo
}) {

  const updateNotificationEmailMutation = useMutation(updateUserSettings)
  const updatePreferenceMutation = useMutation(updateUserSettings)
  const deleteAccountMutation = useMutation(deleteAccount, {
    onSuccess() {
      toast({
        title: 'Deleted',
        status: 'success',
        position: 'top'
      })
      signOut()
    },
    onError() {
      toast({
        title: 'Something went wrong',
        status: 'error',
        position: 'top'
      })
      setIsOpenDeleteAccountModal(false)
    }
  })

  const [isDisableDeleteAccount, setIsDisableDeleteAccount] = React.useState(true)

  const [confirmUsername, setConfirmUsername] = React.useState("")
  const onChangeConfirmUsername = (event) => {
    setConfirmUsername(event.target.value)
    if (event.target.value === props.session.user.name) {
        setIsDisableDeleteAccount(false)
    } else {
        setIsDisableDeleteAccount(true)
    }
  }

  const [isOpenDeleteAccountModal, setIsOpenDeleteAccountModal] = React.useState(false)
  const cancelDeleteAccountRef = React.useRef()
  const onCloseDeleteAccountModal = () => {
    setIsOpenDeleteAccountModal(false)
  }

  const toast = useToast()

  const notificationEmailInputRef = React.useRef(null)

  function onClickSaveNotificationEmail() {

    const value = notificationEmailInputRef.current.value

    if(!validateEmail(value)) {
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
        signOut()
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

  const DeleteAccountDialog = (
    <AlertDialog
      isOpen={isOpenDeleteAccountModal}
      leastDestructiveRef={cancelDeleteAccountRef}
      onClose={onCloseDeleteAccountModal}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Account
            </AlertDialogHeader>

          <AlertDialogBody>
            <Text mb="8px">
              Are you sure?
            </Text>
            <Text mb="8px">
              This action cannot be undone. This will permanently delete your account, projects and comments.
            </Text>
            <Text mb="8px">
              Please type <strong>{props.session.user.name}</strong> to confirm.
            </Text>
            <Input value={confirmUsername} onChange={onChangeConfirmUsername} type="text" />
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelDeleteAccountRef} onClick={onCloseDeleteAccountModal}>
              Cancel
              </Button>
            <Button ml={4} colorScheme="red" isDisabled={isDisableDeleteAccount}  onClick={_ => deleteAccountMutation.mutate()} isLoading={deleteAccountMutation.isLoading}>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )

  return (
    <>
  <Head title="User Settings" />
      <Navbar session={props.session} />
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
              
          <VStack alignItems="flex-start" spacing={4}>
            <Heading size="md">Danger Zone</Heading>
            <VStack spacing={4}>
              <Button colorScheme="red" onClick={_ => setIsOpenDeleteAccountModal(true)} isLoading={deleteAccountMutation.isLoading}>Delete Account</Button>
              {DeleteAccountDialog}
            </VStack>
          </VStack>

        </VStack>
      </Container>

      <Footer maxWidth="5xl" />
    </>
  )
}

type DefaultUserInfo = Pick<User, "notificationEmail" | "email" | "name" | "enableNewCommentNotification">
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
      email: true
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