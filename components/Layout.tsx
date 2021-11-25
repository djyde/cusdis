import { Box, Container, CSSObject, Flex, HStack, LinkBox, LinkOverlay, VStack, Text, Image, Link, Spacer, Button, Icon } from "@chakra-ui/react"
import React from "react"
import { useQuery } from "react-query"
import { getAllProjects } from "../pages/dashboard"
import { UserSession } from "../service"
import NextLink from 'next/link'
import { useRouter } from "next/router"
import { SettingsIcon } from '@chakra-ui/icons'

export function MainLayout(props: { session: UserSession, children?: any }) {

  const router = useRouter()

  const getProjects = useQuery("getProjects", getAllProjects, {
    enabled: !!props.session,
  })

  const selectedMenuItemStyle: CSSObject = {
    bgColor: 'gray.50',
  }

  return (
    <>
      <Container maxW="container.xl">
        <Flex>
          <Box borderRight="0" borderColor="gray.200" w="64">
            <HStack align="center" p={6} spacing="2" mb="12">
              <Image w={12} src="/images/artworks/logo-256.png" />
              <Text fontSize="md" fontWeight="bold" color="gray.700">Cusdis</Text>
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
                        <LinkBox {...styles} transition="all .2s" rounded="md" px="2" py="1"  _hover={selectedMenuItemStyle}>
                          <NextLink passHref href={`/dashboard/project/${project.id}`}>
                            <LinkOverlay>
                              <Text color="gray.700" fontSize="sm">
                                {project.title}
                              </Text>
                            </LinkOverlay>
                          </NextLink>
                        </LinkBox>
                      </>
                    )
                  })}
                </Box>
              </Box>

              <VStack align="stretch" px="6">
                <NextLink href="/user" passHref>
                  <Link fontSize="sm" color="gray.500" fontWeight="medium">
                    <Icon as={SettingsIcon} mr="2" />
                    Settings
                  </Link>
                </NextLink>
              </VStack>
            </VStack>
          </Box>

          <Box flex="1" p="8">
            {props.children}
          </Box>
        </Flex>
      </Container>

    </>
  )
}
