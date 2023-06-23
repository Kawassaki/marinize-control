import { Heading, Button } from '@kawassaki-ui/react'
import { Container, Header } from './styles'
import { Plus } from 'phosphor-react'

import { MouseEvent } from 'react'
import { RegisterTableComponent } from './components/table'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { useRouter } from 'next/router'

export default function Produtos() {
  const router = useRouter()

  async function handleRegisterProductClick(e: MouseEvent) {
    await router.push('/produtos/cadastro')
  }

  return (
    <>
      <Container>
        <Header>
          <Heading>Produtos</Heading>
          <Button onClick={handleRegisterProductClick}>
            <Plus /> Cadastrar Produtos
          </Button>
        </Header>
        <RegisterTableComponent />
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )
  if (!session?.user.is_admin) {
    return {
      redirect: {
        permanent: true,
        destination: '/',
      },
    }
  }
  return {
    props: {
      session,
    },
  }
}
