import { Text, TextInput, Modal } from '@kawassaki-ui/react'
import { useRef } from 'react'
import { Container } from './styles'

export interface CadastroProps {
  showModal: boolean
  setShowModal: (showModal: boolean) => void
}

export function Cadastro({ showModal, setShowModal }: CadastroProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  return (
    <Modal
      ref={ref}
      showModal={showModal}
      onCloseModal={() => setShowModal(false)}
      size="md"
      modalTitle="Cadastro de Cliente"
      overlay="medium"
      isModalWithActions
      secondaryButtonLabel="Limpar"
      primaryButtonLabel="Salvar"
      onPrimaryButtonClick={() => console.log('Limpar clicked')}
      onSecondaryButtonClick={() => console.log('Salvar clicked')}
    >
      <Container as="form">
        <label>
          <Text>CPF</Text>
          <TextInput />
        </label>
        <label>
          <Text>Nome Completo</Text>
          <TextInput />
        </label>
        <label>
          <Text>Email</Text>
          <TextInput />
        </label>
        <label>
          <Text>Telefone</Text>
          <TextInput />
        </label>
        <label>
          <Text>Endereço</Text>
          <TextInput />
        </label>
      </Container>
    </Modal>
  )
}
