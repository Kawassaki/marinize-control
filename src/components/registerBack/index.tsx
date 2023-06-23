import { MouseEvent } from 'react'
import { Header } from './styles'
import { Heading, IconButton } from '@kawassaki-ui/react'
import { ArrowLeft } from 'phosphor-react'

interface RegisterBackProps {
  title: string
  handleButtonClick: (e: MouseEvent<HTMLButtonElement>) => void
}

export function RegisterBack({ title, handleButtonClick }: RegisterBackProps) {
  return (
    <Header>
      <IconButton
        type="button"
        size="sm"
        icon={<ArrowLeft />}
        onClick={handleButtonClick}
      />
      <Heading>{title}</Heading>
    </Header>
  )
}
