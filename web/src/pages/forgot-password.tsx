import React, { useState } from 'react'
import { withUrqlClient } from 'next-urql'
import { Box, Flex, Link, Button } from '@chakra-ui/core'
import { Formik, Form } from 'formik'
import NextLink from 'next/link'

import { createUrqlClient } from '../utils/createUrqlClient'
import { Wrapper } from '../components/Wrapper'
import { toErrorMap } from '../utils/toErrorMap'
import { InputField } from '../components/InputField'
import { useForgotPasswordMutation } from '../generated/graphql'

interface ForgotPassword {}

const ForgotPassword: React.FC<ForgotPassword> = ({}) => {
  const [complete, setComplete] = useState(false)
  const [, forgotPassword] = useForgotPasswordMutation()
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword({ email: values.email })
          setComplete(true)
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>check your email</Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />

              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                Forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
