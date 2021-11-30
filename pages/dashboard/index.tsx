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
  Image,
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
  CSSObject,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { Project } from "@prisma/client"
import type { UserSession } from "../../service"
import { useRouter } from "next/router"
import { Head } from "../../components/Head"
import { Footer } from "../../components/Footer"
import { Navbar } from "../../components/Navbar"
import { getSession } from "../../utils.server"
import { MainLayout } from "../../components/Layout"
import { ProjectService } from "../../service/project.service"

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

function Dashboard() {
  return (
    <div>

    </div>
  )
}

export async function getServerSideProps(ctx) {

  console.log('hhhhhhh')

  const projectService = new ProjectService(ctx.req)

  const defaultProject = await projectService.getFirstProject({
    select: {
      id: true
    }
  })

  if (!defaultProject) {
    return {
      redirect: {
        destination: `/getting-start`,
        permanent: false
      }
    }
  } else {
    // redirect to project dashboard
    return {
      redirect: {
        destination: `/dashboard/project/${defaultProject.id}`,
        permanent: false
      }
    }
  }
}

export default Dashboard
