import Image from 'next/image'
import { Actions, Container, Content, CustomLink, UserInfo } from './styles'
import marinizeLogo from '../../assets/marinize-logo.svg'

import { Avatar, IconButton } from '@kawassaki-ui/react'
import { SignIn, SignOut } from 'phosphor-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Header() {
  const session = useSession()
  const router = useRouter()
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
            <CustomLink
              href="/clientes"
              urlActive={router.pathname.includes('/clientes')}
            >
              Clientes
            </CustomLink>
            <CustomLink
              href="/fornecedores"
              urlActive={router.pathname.includes('/fornecedores')}
            >
              Fornecedores
            </CustomLink>
            <CustomLink
              href="/produtos"
              urlActive={router.pathname.includes('/produtos')}
            >
              Produtos
            </CustomLink>
            <CustomLink
              href="/pedido"
              urlActive={router.pathname.includes('/pedido')}
            >
              Pedido
            </CustomLink>
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
