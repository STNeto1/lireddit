import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  Icon,
  IconButton,
} from '@chakra-ui/core'
import { withUrqlClient } from 'next-urql'
import NextLink from 'next/link'
import { useState } from 'react'
import { Layout } from '../components/Layout'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { UpdootSection } from '../components/UpdootSection'

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  })

  const [{ data, fetching }] = usePostsQuery({
    variables,
  })

  if (!fetching && !data) {
    return <div>You query failed for some reason</div>
  }

  return (
    <Layout>
      {!data && fetching ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) => (
            <Flex p={5} shadow="md" borderWidth="1px" key={p.id}>
              <UpdootSection post={p} />

              <Box>
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                    <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                </NextLink>

                <Text>posted by {p.creator.username}</Text>
                <Text>{p.textSnippet}</Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}

      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
