import React from 'react'
import { Box, Link, Flex, Button, Heading } from '@chakra-ui/core'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import { useMeQuery, useLogoutMutation } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter()
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
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={4}>
            create post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout()
            router.reload()
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
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  )
}
