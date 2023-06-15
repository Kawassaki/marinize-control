import Image from 'next/image'
import { Actions, Container, Content, UserInfo } from './styles'
import marinizeLogo from '../../assets/marinize-logo.svg'
import Link from 'next/link'
import { Avatar, IconButton } from '@kawassaki-ui/react'
import { SignIn, SignOut } from 'phosphor-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useMemo } from 'react'

export default function Header() {
  const session = useSession()

  const isSignedIn = useMemo(
    () => session.status === 'authenticated',
    [session.status],
  )

  async function handleSignIn() {
    await signIn('google')
  }

  async function handleSignOut() {
    await signOut()
  }

  return (
    <Container>
      <Content>
        <Link href="/">
          <Image
            src={marinizeLogo}
            quality={100}
            priority
            alt="Marinize Logo"
          />
        </Link>
        {isSignedIn ? (
          <Actions>
            <Link href="/clientes">Clientes</Link>
            <Link href="/fornecedores">Fornecedores</Link>
            <Link href="/produtos">Produtos</Link>
            <Link href="/pedido">Pedido</Link>
          </Actions>
        ) : null}
        <UserInfo>
          {!isSignedIn ? (
            <IconButton
              variant="primary"
              onClick={handleSignIn}
              icon={<SignIn />}
            />
          ) : (
            <>
              <IconButton
                variant="primary"
                onClick={handleSignOut}
                icon={<SignOut />}
              />
              <Avatar src={session.data?.user.avatar_url} />
            </>
          )}
        </UserInfo>
      </Content>
    </Container>
  )
}
