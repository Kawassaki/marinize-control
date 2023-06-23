import { IconButton, Table, Text } from '@kawassaki-ui/react'
import { Trash } from 'phosphor-react'
import { Actions, CustomModal, ModalContent, TrStyled } from './styles'
import { useState } from 'react'
import { api } from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { errorToast, successToast } from '@/components/toast'
import { AxiosError } from 'axios'
import useDidMount from '@rooks/use-did-mount'

export interface RegisterTableProps {
  id?: string
}

interface Supplier {
  id: string
  name: string
  legal_name: string
  supplier_type: string
  cnpj: string
  cpf: string
  address: string
}

interface Suppliers {
  suppliers?: Supplier[]
}

const Thead = () => {
  return (
    <TrStyled>
      <th>Tipo</th>
      <th>Name</th>
      <th>CPF</th>
      <th>Razão Social</th>
      <th>CNPJ</th>
      <th>Endereço</th>
      <th></th>
    </TrStyled>
  )
}

export function RegisterTableComponent({ id = 'test' }: RegisterTableProps) {
  const { data: session } = useSession()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [supplierSelected, setSupplierSelected] = useState<string | null>(null)

  const userId = session?.user?.id

  const { refetch, data, isLoading } = useQuery<Suppliers>(
    ['suppliers', userId],
    async () => {
      const response = await api.get(`/suppliers`, {
        params: { userId },
      })
      return response.data
    },
    {
      enabled: !!userId,
      staleTime: 10 * (60 * 1000),
      cacheTime: 30 * (60 * 1000),
    },
  )

  useDidMount(() => {
    refetch()
  })

  function handleDeleteSupplierClick(supplierId: string) {
    setSupplierSelected(supplierId)
    setShowDeleteModal(true)
  }

  async function handleDeleteSupplierModalClick() {
    await api
      .delete(`/suppliers/delete`, {
        params: {
          supplierId: supplierSelected,
          userId: session?.user?.id,
        },
      })
      .then(async (item) => {
        if (item.status === 200) {
          successToast('Fornecedor excluido com successo!')
          refetch()
          setShowDeleteModal(false)
        }
      })
      .catch((err) => {
        if (err instanceof AxiosError && err?.response?.data?.message)
          errorToast(err.response.data.message)
        else
          errorToast(
            'Não foi possível cadastrar o fornecedor entre em contato com o suporte',
          )
      })
  }

  return (
    <>
      {!isLoading ? (
        <Table
          thList={<Thead />}
          trList={
            <>
              {data?.suppliers && data.suppliers.length > 0 ? (
                data.suppliers.map((supplier) => {
                  return (
                    <TrStyled key={supplier.id}>
                      <td>
                        {supplier.supplier_type === 'pessoaFisica'
                          ? 'Pessoa Fisica'
                          : 'Pessoa Júridica'}
                      </td>
                      <td>{supplier.name || '-'}</td>
                      <td>{supplier.cpf || '-'}</td>
                      <td>{supplier.legal_name || '-'}</td>
                      <td>{supplier.cnpj || '-'}</td>
                      <td>{supplier.address || '-'}</td>
                      <td>
                        <Actions>
                          <IconButton
                            icon={<Trash />}
                            onClick={() =>
                              handleDeleteSupplierClick(supplier.id)
                            }
                          />
                        </Actions>
                      </td>
                    </TrStyled>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <Text>Não existe nenhum fornecedor</Text>
                  </td>
                </tr>
              )}
            </>
          }
          id={id}
        />
      ) : (
        <>Loading...</>
      )}
      <CustomModal
        showModal={showDeleteModal}
        modalTitle="Excluir Fornecedor"
        onCloseModal={() => setShowDeleteModal(false)}
        isModalWithActions
        primaryButtonLabel="Confirmar"
        secondaryButtonLabel="Cancelar"
        onPrimaryButtonClick={handleDeleteSupplierModalClick}
        onSecondaryButtonClick={() => setShowDeleteModal(false)}
        size="sm"
      >
        <ModalContent>
          <Text>Tem certeza que deseja excluir esse fornecedor?</Text>
        </ModalContent>
      </CustomModal>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  )
  return {
    props: {
      session,
    },
  }
}
