import { IconButton, Table, Text } from '@kawassaki-ui/react'
import { Trash } from 'phosphor-react'
import { CustomModal, ModalContent, TrStyled, Actions } from './styles'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

import { api } from '@/lib/axios'
import { errorToast, successToast } from '@/components/toast'
import { AxiosError } from 'axios'
import useDidMount from '@rooks/use-did-mount'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

export interface RegisterTableProps {
  id?: string
}

export interface ProductProps {
  id: string
  barcode: string
  date_collection: string
  final_price: string
  name: string
  price_without_profit: string
  profit_percentage: string
  reference_code: string
  season: string
  size: string
  stock_amount: string
  stock_minimum: string
  supplier: {
    id: string
    name: string
    legal_name: string
    supplier_type: string
    cnpj: string
    cpf: string
    address: string
  }
}

export interface Products {
  products?: ProductProps[]
}

const Thead = () => {
  return (
    <tr>
      <th>Codigo de Referência</th>
      <th>Codigo de Barras</th>
      <th>Nome</th>
      <th>Tamanho</th>
      <th>Preço de Custo</th>
      <th>% de lucro</th>
      <th>Preço de Venda</th>
      <th>Coleção</th>
      <th>Data da Coleção</th>
      <th>Estoque Minimo</th>
      <th>Estoque Atual</th>
      <th>Fornecedor</th>
      <th></th>
    </tr>
  )
}

export function TableComponent({ id = 'test' }: RegisterTableProps) {
  const { data: session } = useSession()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productSelected, setProductSelected] = useState<string | null>(null)

  const userId = session?.user?.id

  const { refetch, data } = useQuery<Products>(
    ['products', userId],
    async () => {
      const response = await api.get(`/products`, {
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

  function handleDeleteProductClick(productId: string) {
    setProductSelected(productId)
    setShowDeleteModal(true)
  }

  async function handleDeleteProductModalClick() {
    await api
      .delete(`/products/delete`, {
        params: {
          productId: productSelected,
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
      <Table
        thList={<Thead />}
        trList={
          <>
            {data?.products && data.products.length > 0 ? (
              data.products.map((product) => {
                return (
                  <TrStyled key={product.id}>
                    <td>{product.reference_code || '-'}</td>
                    <td>{product.barcode || '-'}</td>
                    <td>{product.name || '-'}</td>
                    <td>{product.size || '-'}</td>
                    <td>{`R$${product.price_without_profit}` || '-'}</td>
                    <td>{`${product.profit_percentage}%` || '-'}</td>
                    <td>{`R$${product.final_price}` || '-'}</td>
                    <td>{product.season || '-'}</td>
                    <td>
                      {dayjs(new Date(product.date_collection)).format(
                        'DD/MM/YYYY',
                      ) || '-'}
                    </td>
                    <td>{product.stock_minimum || '-'}</td>
                    <td>{product.stock_amount || '-'}</td>
                    <td>
                      {product.supplier.name ||
                        product.supplier.legal_name ||
                        '-'}
                    </td>
                    <td>
                      <Actions>
                        <IconButton
                          icon={<Trash />}
                          onClick={() => handleDeleteProductClick(product.id)}
                        />
                      </Actions>
                    </td>
                  </TrStyled>
                )
              })
            ) : (
              <tr>
                <td colSpan={7}>
                  <Text>Não existe nenhum Produto</Text>
                </td>
              </tr>
            )}
          </>
        }
        id={id}
      />
      <CustomModal
        showModal={showDeleteModal}
        modalTitle="Excluir Produto"
        onCloseModal={() => setShowDeleteModal(false)}
        isModalWithActions
        primaryButtonLabel="Confirmar"
        secondaryButtonLabel="Cancelar"
        onPrimaryButtonClick={handleDeleteProductModalClick}
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
