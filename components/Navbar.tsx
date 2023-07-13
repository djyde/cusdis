import {
  Box,
  Container,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
} from "@chakra-ui/react"
import React from "react"
import { signOut } from "next-auth/client"
import { UserSession } from "../service"

export function Navbar(props: { session: UserSession }) {
  return (
    <Box py={4}>
      <Container maxWidth={"5xl"}>
        <Flex>
          <Box>
            <Link fontWeight="bold" fontSize="xl" href="/dashboard">
              Cusdis
            </Link>
          </Box>
          <Spacer />
          <Box>
            <Menu>
              <MenuButton>{props.session.user.name}</MenuButton>
              <MenuList>
                <MenuItem><Link width="100%" href="/user">Settings</Link></MenuItem>
                <MenuItem onClick={() => signOut()}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Container>
    </Box>
  )
}
