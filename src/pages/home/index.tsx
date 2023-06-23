import { Button, Heading } from '@kawassaki-ui/react'
import { Container } from './styles'
import { GoogleLogo } from 'phosphor-react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { signIn, useSession } from 'next-auth/react'
import { useMemo } from 'react'

export default function Home() {
  const session = useSession()
  const isSignedIn = useMemo(
    () => session.status === 'authenticated',
    [session.status],
  )

  async function handleSignIn() {
    await signIn('google')
  }
  return (
    <Container>
      <Heading>Bem Vindo!</Heading>

      {!isSignedIn && (
        <Button variant="primary" size="md" onClick={handleSignIn}>
          <GoogleLogo />
          Login com Gmail
        </Button>
      )}
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )
  return {
    props: {
      session,
    },
  }
}
