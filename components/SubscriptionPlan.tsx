import { SimpleGrid, VStack, Heading, Box, List, ListItem, Text } from '@chakra-ui/react'
import * as React from 'react'

export function SubscriptionPlan() {
  return (
    <>
      <SimpleGrid columns={[1, 2]} spacing={8}>
        <VStack border="1px solid" borderColor="gray.200" py={6} rounded="lg">
          <Heading size="xl" textAlign="center">$0</Heading>
          <Box px={6} pb={3}>
            <Text fontSize="sm" color="gray.500">
              Free
                    </Text>
          </Box>

          <Box w="full" borderTop="1px solid" borderColor="gray.200" p={6}>
            <List fontSize="sm" spacing={2}>
              <ListItem>
                <strong>2</strong> Websites
                    </ListItem>
              <ListItem>
                Email Notification
                    </ListItem>

              <ListItem>
                Webhook
              </ListItem>
            </List>

          </Box>
        </VStack>
        <VStack border="1px solid" borderColor="gray.200" py={6} rounded="lg">
          <Heading size="xl" textAlign="center"><del>$5</del> <Text as="span" fontSize="sm">/month</Text></Heading>
          <Box px={6} pb={3}>
            <Text fontSize="sm" color="gray.500">
              Cusdis is totally free for now.
                  </Text>
          </Box>

          <Box w="full" borderTop="1px solid" borderColor="gray.200" p={6}>
            <List fontSize="sm" spacing={2}>
              <ListItem>
                All features in Free plan
                    </ListItem>
              <ListItem>
                <strong>Unlimited</strong> Websites
                    </ListItem>

            </List>
          </Box>
        </VStack>
      </SimpleGrid>
    </>
  )
}
