import React from 'react'
import { Box, Link, Flex, Button } from '@chakra-ui/core'
import NextLink from 'next/link'

import { useMeQuery } from '../generated/graphql'

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery()

  let body = null

  // data is loading
  if (fetching) {
    // user not loggedin
  } else if (!data?.me) {
    body = (
      <>
        <Box ml={'auto'}>
          <NextLink href="/login">
            <Link mr={2}>Login</Link>
          </NextLink>

          <NextLink href="/register">
            <Link>Register</Link>
          </NextLink>
        </Box>
      </>
    )

    // user is logged in
  } else {
    body = (
      <Flex align="center" justifyContent="flex-end">
        <Box mr={2}>{data.me.username}</Box>
        <Button variant="link">Logout</Button>
      </Flex>
    )
  }

  return (
    <Flex bg="tomato" p={4}>
      {body}
    </Flex>
  )
}
