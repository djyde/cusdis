import { Link } from '@chakra-ui/layout'
import { createStandaloneToast } from '@chakra-ui/toast'
import axios from 'axios'
import React from 'react'
import { UpgradeToastBody } from './components/UpgradeToastBody'

export const globalToast = createStandaloneToast()

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'x-timezone-offset': -new Date().getTimezoneOffset(),
  },
})

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    if (err.response.status === 402) {
      globalToast({
        position: 'top',
        title: 'You have reached the free plan limit',
        status: 'warning',
        isClosable: true,
        description: React.createElement(UpgradeToastBody, {
          msg: err.response.data.message,
        }),
      })
    }

    throw err
  },
)

export const VERSION = '1.2.1'
