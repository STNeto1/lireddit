import React from 'react'
import { Box, Link, Flex, Button } from '@chakra-ui/core'
import NextLink from 'next/link'

import { useMeQuery, useLogoutMutation } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  })

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
        <Button
          onClick={() => {
            logout()
          }}
          variant="link"
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    )
  }

  return (
    <Flex bg="tan" p={4}>
      {body}
    </Flex>
  )
}
