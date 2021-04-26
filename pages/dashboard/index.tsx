import * as React from "react"
import { signIn, useSession } from "next-auth/client"
import { apiClient } from "../../utils.client"
import { useMutation, useQuery } from "react-query"
import {
  AddIcon,
  BellIcon
} from '@chakra-ui/icons'
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Tag,
  Text,
  toast,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { Project } from "@prisma/client"
import type { UserSession } from "../../service"
import { useRouter } from "next/router"
import { Head } from "../../components/Head"
import { Footer } from "../../components/Footer"
import { Navbar } from "../../components/Navbar"
import { getSession } from "../../utils.server"

export const createProject = async (body: { title: string }) => {
  const res = await apiClient.post("/projects", {
    title: body.title,
  })
  return res.data
}

export const getAllProjects = async () => {
  const res = await apiClient.get<{
    data: Project[]
  }>("/projects")
  return res.data.data
}

function Dashboard(props: { session: UserSession }) {
  const getProjects = useQuery("getProjects", getAllProjects, {
    enabled: !!props.session,
  })

  const toast = useToast()
  const router = useRouter()

  const createProjectModal = useDisclosure()

  const createProjectMutation = useMutation(createProject)

  const form = useForm()

  async function onSubmit(data) {
    await createProjectMutation.mutate(
      {
        title: data.title,
      },
      {
        onSuccess(data) {
          toast({
            status: "success",
            title: "Project created",
          })
          router.push(`/dashboard/project/${data.data.id}`, null, {
            shallow: true,
          })
          createProjectModal.onClose()
        },
      }
    )
  }

  React.useEffect(() => {
    if (!props.session) {
      signIn()
    }
  }, [!props.session])

  if (!props.session) {
    return <div>Redirecting to signin..</div>
  }

  return (
    <>
      <Head title="Cusdis" />
      <Navbar session={props.session} />
      <Modal
        isOpen={createProjectModal.isOpen}
        onClose={createProjectModal.onClose}
      >
        <ModalOverlay></ModalOverlay>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>New Website</ModalHeader>
            <ModalCloseButton />

            <ModalBody>
              <FormControl isRequired id="title">
                <FormLabel>Title</FormLabel>
                <Input type="text" {...form.register("title")}></Input>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button isLoading={createProjectMutation.isLoading} type="submit">
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
      <Container maxW="5xl" pt={24}>
        <VStack alignItems="stretch" spacing={4}>
          <Heading>
            Websites
          </Heading>

          <Box>
            <SimpleGrid columns={[1, 1, 4]} spacing={4}>
              {getProjects.isLoading && (
                <>
                  <Skeleton height={4} />
                  <Skeleton height={4} />
                  <Skeleton height={4} />
                </>
              )}
              {getProjects.data?.map((project) => {
                return (
                  <LinkBox
                    py={4}
                    px={4}
                    cursor="pointer"
                    shadow="sm"
                    rounded="lg"
                    _hover={{
                      shadow: 'base'
                    }}
                    key={project.id}>
                    <LinkOverlay href={`/dashboard/project/${project.id}`}>
                      <HStack alignItems="start">
                        <Text>{project.title}</Text>
                        <Spacer />
                        <Box zIndex={1}>
                          {project.enableNotification && <Tooltip label="Notification enabled">
                            <BellIcon />
                          </Tooltip>}
                        </Box>
                      </HStack>
                    </LinkOverlay>
                  </LinkBox>
                )
              })}
              <LinkBox
                py={4}
                px={4}
                cursor="pointer"
                shadow="sm"
                rounded="lg"
                _hover={{
                  shadow: 'base'
                }}>
                <LinkOverlay
                  onClick={(_) => createProjectModal.onOpen()}
                  fontWeight="medium">
                  <VStack>
                    <AddIcon />
                    <Text>Add Website</Text>
                  </VStack>
                </LinkOverlay>
              </LinkBox>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>

      <Footer maxWidth="5xl" />
    </>
  )
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      session: await getSession(ctx.req),
    },
  }
}

export default Dashboard
