import { Heading, Button } from '@kawassaki-ui/react'
import { Container, Header } from './styles'
import { Plus } from 'phosphor-react'

import { MouseEvent } from 'react'
import { RegisterTableComponent } from './components/consulta'
import { useRouter } from 'next/router'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'
import { getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next'

export default function Fornecedores() {
  const router = useRouter()

  async function handleRegisterClientClick(e: MouseEvent) {
    await router.push('/fornecedores/cadastro')
  }

  return (
    <Container>
      <Header>
        <Heading>Fornecedores</Heading>
        <Button onClick={handleRegisterClientClick}>
          <Plus /> Cadastrar Fornecedor
        </Button>
      </Header>
      <RegisterTableComponent />
    </Container>
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
