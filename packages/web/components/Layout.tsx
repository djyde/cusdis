import { Box, Container, CSSObject, Flex, HStack, LinkBox, LinkOverlay, VStack, Text, Image, Link, Spacer, Button, Icon, Tooltip, Modal, ModalOverlay, ModalBody, useDisclosure, ModalHeader, FormControl, Input, ModalContent, FormLabel, ModalFooter, ModalCloseButton, useToast } from "@chakra-ui/react"
import React from "react"
import { useMutation, useQuery } from "react-query"
import { getAllProjects } from "../pages/dashboard"
import { UserSession } from "../service"
import NextLink from 'next/link'
import { useRouter } from "next/router"
import { SettingsIcon } from '@chakra-ui/icons'
import { AiOutlineLogout, AiOutlineSetting, AiOutlineFileText, AiOutlineAlert, AiOutlinePlus } from 'react-icons/ai'
import { signout, signOut } from "next-auth/client"
import { Footer } from "./Footer"
import { createProject } from "../pages/getting-start"

// just for type
const LinkBox2 = LinkBox as any

export function MainLayout(props: { session: UserSession, children?: any }) {

  const router = useRouter()

  const createProjectMutation = useMutation(createProject)
  const createProjectModal = useDisclosure()
  const toast = useToast()
  const titleInputRef = React.useRef<HTMLInputElement>(null)

  const getProjects = useQuery("getProjects", getAllProjects, {
    enabled: !!props.session,
  })

  const selectedMenuItemStyle: CSSObject = {
    bgColor: 'gray.50',
  }

  async function onClickCreateProject() {
    if (!titleInputRef.current.value) {
      return
    }

    await createProjectMutation.mutate(
      {
        title: titleInputRef.current.value,
      },
      {
        onSuccess(data) {
          toast({
            status: "success",
            title: "Project created",
          })
          location.href = `/dashboard/project/${data.data.id}`
        },
      }
    )
  }

  return (
    <>
      <Container maxW="container.xl">
        <Flex>
          <Box borderRight="0" borderColor="gray.200" w="64">
            <HStack align="center" p={6} spacing="2" mb="12">
              <Image w={12} src="/images/artworks/logo-256.png" />
              <Link href="/" fontSize="md" fontWeight="bold" color="gray.700">Cusdis</Link>
            </HStack>

            <VStack align="stretch" spacing="48">
              <Box>
                <Flex px="6">
                  <Text fontWeight="medium" color="gray.500" fontSize="xs" mb="2">WEBSITES</Text>
                  <Spacer />
                  {/* <Button aria-label="Add new website" size="xs">+</Button> */}
                </Flex>
                <Box px="4">
                  {getProjects.data?.map(project => {

                    const styles = router.asPath === `/dashboard/project/${project.id}` ? selectedMenuItemStyle : {}

                    return (
                      <>
                        <LinkBox2 {...styles} transition="all .2s" rounded="md" px="2" py="1" _hover={selectedMenuItemStyle}>
                          <NextLink passHref href={`/dashboard/project/${project.id}`}>
                            <LinkOverlay>
                              <HStack align="center" >
                                {/* <Box width="5px" height="5px" borderRadius="50%" bgColor="green.400">
                                </Box> */}
                                <Text color="gray.700" fontSize="sm">
                                  {project.title}
                                </Text>
                                <Spacer />
                              </HStack>
                            </LinkOverlay>
                          </NextLink>
                        </LinkBox2>
                      </>
                    )
                  })}
                </Box>

                <Box p={4}>
                  <Modal isOpen={createProjectModal.isOpen} onClose={createProjectModal.onClose}>
                    <ModalOverlay />

                    <ModalContent>
                      <ModalHeader>
                        New website
                      </ModalHeader>
                      <ModalCloseButton />

                      <ModalBody>
                        <FormControl>
                          <FormLabel>
                            Website name
                          </FormLabel>
                          <Input ref={titleInputRef}></Input>
                        </FormControl>
                      </ModalBody>
                      <ModalFooter>
                        <Button onClick={_ => void onClickCreateProject()} isLoading={createProjectMutation.isLoading} >Create</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                  <Button onClick={createProjectModal.onOpen} leftIcon={<Icon as={AiOutlinePlus} />} size="xs" w="full">
                    New website
                  </Button>
                </Box>
              </Box>

              <VStack align="stretch" px="6">
                <NextLink href="/user" passHref>
                  <Link fontSize="sm" color="gray.500" fontWeight="medium">
                    <Icon as={AiOutlineSetting} mr="2" />
                    Settings
                  </Link>
                </NextLink>

                <Link href="/doc" isExternal fontSize="sm" color="gray.500" fontWeight="medium">
                  <Icon as={AiOutlineFileText} mr="2" />
                  Documentation
                </Link>

                <Link onClick={_ => signOut()} fontSize="sm" color="gray.500" fontWeight="medium">
                  <Icon as={AiOutlineLogout} mr="2" />
                  Logout
                </Link>

              </VStack>
            </VStack>
          </Box>

          <Box flex="1" p="8">
            {props.children}
          </Box>

        </Flex>

        <Footer />

      </Container>

    </>
  )
}
