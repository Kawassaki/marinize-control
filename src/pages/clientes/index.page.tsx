import { Heading, Button } from '@kawassaki-ui/react'
import { Container, Header } from './styles'
import { Plus } from 'phosphor-react'
import { Cadastro } from './components/cadastro'
import { MouseEvent, useState } from 'react'
import { RegisterTableComponent } from './components/table'

export default function Clientes() {
  const [showModal, setShowModal] = useState(false)

  function handleRegisterClientClick(e: MouseEvent) {
    e.preventDefault()
    setShowModal((current) => !current)
  }

  return (
    <Container>
      <Header>
        <Heading>Clientes</Heading>
        <Button onClick={handleRegisterClientClick}>
          <Plus /> Cadastrar Cliente (F1)
        </Button>
      </Header>
      <RegisterTableComponent />
      <Cadastro showModal={showModal} setShowModal={setShowModal} />
    </Container>
  )
}
