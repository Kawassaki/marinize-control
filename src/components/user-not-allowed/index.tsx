import { Container } from './styles'
import { Heading } from '@kawassaki-ui/react'

export const UserNotAllowed = () => {
  return (
    <Container>
      <Heading>
        Você não tem acesso a este módulo, contate o administrador!
      </Heading>
    </Container>
  )
}
