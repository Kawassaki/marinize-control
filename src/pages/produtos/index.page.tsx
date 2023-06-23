import { Heading, Button } from '@kawassaki-ui/react'
import { Container, Header } from './styles'
import { Plus } from 'phosphor-react'
import { Cadastro } from './components/cadastro'
import { MouseEvent, useState } from 'react'
import { RegisterTableComponent } from './components/table'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '../api/auth/[...nextauth].api'

export default function Produtos() {
  const [showModal, setShowModal] = useState(false)

  function handleRegisterClientClick(e: MouseEvent) {
    e.preventDefault()
    setShowModal((current) => !current)
  }

  return (
    <>
      <Container>
        <Header>
          <Heading>Produtos</Heading>
          <Button onClick={handleRegisterClientClick}>
            <Plus /> Cadastrar Produtos (F1)
          </Button>
        </Header>
        <RegisterTableComponent />
      </Container>
      <Cadastro showModal={showModal} setShowModal={setShowModal} />
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
