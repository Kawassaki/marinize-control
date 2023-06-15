import { IconButton, Table } from '@kawassaki-ui/react'
import { PencilSimple, Trash } from 'phosphor-react'
import { CustomTd } from './styles'

export interface RegisterTableProps {
  id?: string
}

const Thead = () => {
  return (
    <tr>
      <th>Nome</th>
      <th>CPF</th>
      <th>Email</th>
      <th>Telefone</th>
      <th>Endereço</th>
      <th></th>
    </tr>
  )
}

const TBody = () => {
  return (
    <>
      <tr>
        <td>Felipe Kawassaki</td>
        <td>084.019.589-38</td>
        <td>fekawassaki@gmail.com</td>
        <td>+351 910450969</td>
        <td>Rua Luís de Camões, n8 3DTO</td>
        <CustomTd>
          <IconButton icon={<Trash />} onClick={() => console.log('Exclude')} />
          <IconButton
            icon={<PencilSimple />}
            onClick={() => console.log('Edit')}
          />
        </CustomTd>
      </tr>
      <tr>
        <td>Felipe Kawassaki</td>
        <td>084.019.589-38</td>
        <td>fekawassaki@gmail.com</td>
        <td>+351 910450969</td>
        <td>Rua Luís de Camões, n8 3DTO</td>
        <CustomTd>
          <IconButton icon={<Trash />} onClick={() => console.log('Exclude')} />
          <IconButton
            icon={<PencilSimple />}
            onClick={() => console.log('Edit')}
          />
        </CustomTd>
      </tr>
    </>
  )
}

export function RegisterTableComponent({ id = 'test' }: RegisterTableProps) {
  return <Table thList={<Thead />} trList={<TBody />} id={id} />
}
