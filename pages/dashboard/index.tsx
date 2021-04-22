import * as React from "react"
import { signIn, useSession } from "next-auth/client"
import { apiClient } from "../../utils.client"
import { useMutation, useQuery } from "react-query"
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
  Skeleton,
  Spacer,
  Stack,
  Tag,
  toast,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { Project } from "@prisma/client"
import { ChevronDownIcon } from "@chakra-ui/icons"
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
  const res = await apiClient.get("/projects")
  return res.data.data
}

function Dashboard(props: { session: UserSession }) {
  const getProjects = useQuery<Project[]>("getProjects", getAllProjects, {
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
      <Container maxW="5xl" pt={12}>
        <Flex mb={4}>
          <Button
            onClick={(_) => createProjectModal.onOpen()}
            colorScheme="telegram"
            size="sm"
          >
            Add Website
          </Button>
        </Flex>
        <VStack alignItems="stretch" spacing={4}>
          {getProjects.isLoading && (
            <>
              <Skeleton height={4} />
              <Skeleton height={4} />
              <Skeleton height={4} />
            </>
          )}
          {getProjects.data?.map((project) => {
            return (
              <Link
                href={`/dashboard/project/${project.id}`}
                py={4}
                px={4}
                shadow="sm"
                rounded="lg"
                key={project.id}
              >
                {project.title}
              </Link>
            )
          })}
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
