import { ChangeEvent, useEffect, useState } from 'react'
import { ZodIssueCode, z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Text,
  TextInput,
  Heading,
  RadioButton,
  Select,
  Button,
} from '@kawassaki-ui/react'
import { Divider } from '../../../components/divider'
import {
  Actions,
  Container,
  FormError,
  FormWrapper,
  InfoBlock,
  InputValues,
  RadioButtonArea,
} from './styles'
import { useForm } from 'react-hook-form'
import { Money, Percent } from 'phosphor-react'
import {
  validateCurrencyPattern,
  validateDate,
  validatePercentagePattern,
  validateSizes,
} from '@/pages/utils/validators'
import { fromBRLCurrencyToFloat } from '@/pages/utils/parse'
import { RegisterBack } from '@/components/registerBack'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next'
import { CreateProductProps } from '@/pages/api/products/create.api'
import { api } from '@/lib/axios'
import { errorToast, successToast } from '@/components/toast'
import { AxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Suppliers } from '@/pages/fornecedores/components/consulta'
import { supplierType } from '@/pages/fornecedores/cadastro/index.types'
import useDidMount from '@rooks/use-did-mount'

const registerProductFormSchema = z.object({
  name: z.string().min(1, 'O nome deve conter pelo menos um caracter!'),
  size: z.string().transform((value, ctx) => {
    if (!validateSizes(value)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message:
          'O tamanho precisa ser alguma das seguintes opções: RN 1 2 3 4 6 8 10 12 14 16!',
      })
    }
    return value
  }),
  season: z.string(),
  dateCollection: z.string().transform((stringDate, ctx) => {
    const [day, month, year] = stringDate.split('/')
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    if (!validateDate(date)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'O formato da Data está incorreto! (ex: 24/10/1997)',
      })
    }
    return date
  }),
  stockMinimum: z.string().min(0),
  stockAmount: z.string().min(0),
  supplier: z.object(
    {
      value: z.string(),
      key: z.string(),
      selected: z.boolean(),
    },
    { required_error: 'O fornecedor é obrigatório' },
  ),
  referenceCode: z
    .string()
    .min(1, 'O código de referencia deve conter pelo menos um caracter!'),
  barcode: z
    .string()
    .min(1, 'O código de barras deve conter pelo menos um caracter!'),
  priceWithoutProfit: z
    .string({
      required_error: 'O preço de custo deve conter pelo menos um caracter!',
      invalid_type_error: 'O preço de custo deve conter números!',
    })
    .transform((value, ctx) => {
      if (!validateCurrencyPattern(value)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'O formato do preço está incorreto! (ex: 49,90)',
        })
      }
      return value
    }),
  profitPercentage: z
    .string({
      invalid_type_error: 'A porcentagem deve conter números!',
    })
    .transform((value, ctx) => {
      if (!validatePercentagePattern(value)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'O formato do preço está incorreto! (ex: 10 ou 10.50)',
        })
      }
      return value
    }),
  finalPrice: z
    .string({
      required_error: 'O preço final deve conter pelo menos um caracter!',
      invalid_type_error: 'O preço final deve conter números!',
    })
    .transform((value, ctx) => {
      if (!validateCurrencyPattern(value)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'O formato do preço está incorreto! (ex: 49,90)',
        })
      }
      return value
    }),
})

type RegisterProductFormProps = z.input<typeof registerProductFormSchema>

interface OptionItem {
  value: string
  key: string
  selected: boolean
}

export default function Cadastro() {
  const { data: session } = useSession()
  const [suppliersOptions, setSupplierOptions] = useState<OptionItem[]>()

  const userId = session?.user?.id

  const router = useRouter()

  const { data, refetch } = useQuery<Suppliers>(
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
  useDidMount(async () => {
    await refetch()
  })

  useEffect(() => {
    if (data?.suppliers)
      setSupplierOptions(
        data?.suppliers.map((supplier) => {
          if (supplier.supplier_type === supplierType.PF) {
            return {
              value: supplier.name,
              key: supplier.id,
              selected: false,
            }
          } else {
            return {
              value: supplier.legal_name,
              key: supplier.id,
              selected: false,
            }
          }
        }),
      )
  }, [data])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<RegisterProductFormProps>({
    resolver: zodResolver(registerProductFormSchema),
    defaultValues: {
      season: 'inverno',
    },
  })

  async function handleBackAction() {
    await router.push('/produtos')
  }

  async function handleSubmitProductForm(data: RegisterProductFormProps) {
    const newProduct: CreateProductProps = {
      barcode: data.barcode,
      date_collection: data.dateCollection,
      final_price: data.finalPrice,
      name: data.name,
      price_without_profit: data.priceWithoutProfit,
      profit_percentage: data.profitPercentage,
      reference_code: data.referenceCode,
      season: data.season,
      size: data.size,
      stock_amount: data.stockAmount,
      stock_minimum: data.stockMinimum,
      supplier_id: data.supplier.key,
    }
    try {
      if (session?.user?.is_admin) {
        await api
          .post('/products/create', {
            userId: session?.user?.id,
            product: newProduct,
          })
          .then(async (item) => {
            if (item.status === 201) {
              successToast('Produto criado com sucesso!')
              handleBackAction()
            }
          })
      }
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.data?.message)
        errorToast(err.response.data.message)
      else
        errorToast(
          'Não foi possível cadastrar o fornecedor entre em contato com o suporte',
        )
    }
  }

  const watchPriceWithoutProfit = watch('priceWithoutProfit')
  const watchProfitPercentage = watch('profitPercentage')

  const handlePriceWithoutProfitChange = (e: ChangeEvent<HTMLInputElement>) => {
    const price = e.target.value
    setValue('priceWithoutProfit', price, { shouldValidate: true })
    setValue('finalPrice', price, { shouldValidate: true })

    if (watchProfitPercentage && price) {
      const profit = Number(watchProfitPercentage)
      const finalPrice = (
        fromBRLCurrencyToFloat(price) *
        (1 + profit / 100)
      ).toFixed(2)
      setValue('finalPrice', finalPrice, { shouldValidate: true })
    }
  }

  const handleProfitPercentageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const profit = e.target.value
    setValue('profitPercentage', profit, { shouldValidate: true })

    if (validateCurrencyPattern(profit) && watchPriceWithoutProfit) {
      const price = fromBRLCurrencyToFloat(watchPriceWithoutProfit)
      const finalPrice = (price * (1 + Number(profit) / 100)).toFixed(2)
      setValue('finalPrice', finalPrice, { shouldValidate: true })
    } else {
      setValue('finalPrice', watchPriceWithoutProfit || '', {
        shouldValidate: true,
      })
    }
  }

  const handleFinalPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('gere?')
    const finalPrice = e.target.value

    setValue('finalPrice', finalPrice, { shouldValidate: true })
    if (validateCurrencyPattern(finalPrice) && watchPriceWithoutProfit) {
      const price = fromBRLCurrencyToFloat(watchPriceWithoutProfit)
      const profitPercentage = (
        ((fromBRLCurrencyToFloat(finalPrice) - price) / price) *
        100
      ).toFixed(2)

      setValue('profitPercentage', profitPercentage, { shouldValidate: true })
    }
  }

  return (
    <Container>
      <RegisterBack
        handleButtonClick={handleBackAction}
        title="Cadastro Produto"
      />
      <form onSubmit={handleSubmit(handleSubmitProductForm)}>
        <InfoBlock>
          <Heading size="sm">Informações Básicas</Heading>
          <InputValues flexDirection="column">
            <FormWrapper>
              <Text>Nome do produto</Text>
              <TextInput
                placeholder="Digite o nome do produto"
                {...register('name')}
              />
            </FormWrapper>
            {errors.name ? (
              <FormError as="span" size="sm">
                {errors.name.message}
              </FormError>
            ) : null}
            <FormWrapper>
              <Text>Tamanho</Text>
              <TextInput
                placeholder="Tamanhos possíveis: RN 1 2 3 4 6 8 10 12 14 16"
                {...register('size')}
              />
            </FormWrapper>
            {errors.size ? (
              <FormError as="span" size="sm">
                {errors.size.message}
              </FormError>
            ) : null}
            <FormWrapper>
              <Text>Código de barras</Text>
              <TextInput
                placeholder="Digite o código de barras"
                {...register('barcode')}
              />
            </FormWrapper>
            {errors.barcode ? (
              <FormError as="span" size="sm">
                {errors.barcode.message}
              </FormError>
            ) : null}
            <FormWrapper>
              <Text>Código de referência</Text>
              <TextInput
                placeholder="Digite o código de referência"
                {...register('referenceCode')}
              />
            </FormWrapper>
            {errors.referenceCode ? (
              <FormError as="span" size="sm">
                {errors.referenceCode.message}
              </FormError>
            ) : null}
          </InputValues>
        </InfoBlock>
        <Divider />
        <InfoBlock>
          <Heading size="sm">Fornecedores</Heading>
          <InputValues flexDirection="row">
            <FormWrapper>
              <Text>Selecione o Fornecedor</Text>
              <Select
                options={
                  suppliersOptions || [
                    {
                      value: 'Nenhum fornecedor cadastrado',
                      key: 'none',
                      selected: false,
                    },
                  ]
                }
                onSelectOption={(item) => setValue('supplier', item)}
              />
              {errors.supplier ? (
                <FormError as="span" size="sm">
                  {errors.supplier.message}
                </FormError>
              ) : null}
            </FormWrapper>
          </InputValues>
        </InfoBlock>
        <InfoBlock>
          <Heading size="sm">Coleção</Heading>
          <InputValues flexDirection="row">
            <FormWrapper>
              <Text>Estação</Text>
              <RadioButtonArea>
                <RadioButton
                  fieldName="Outono/Inverno"
                  value="inverno"
                  {...register('season')}
                />
                <RadioButton
                  fieldName="Primavera/Verão"
                  value="verao"
                  {...register('season')}
                />
              </RadioButtonArea>
            </FormWrapper>
            {errors.season ? (
              <FormError as="span" size="sm">
                {errors.season.message}
              </FormError>
            ) : null}
            <FormWrapper>
              <Text>Data coleção</Text>
              <TextInput
                mask="99/99/9999"
                placeholder="dd/mm/aaaa"
                {...register('dateCollection')}
              />
              {errors.dateCollection ? (
                <FormError as="span" size="sm">
                  {errors.dateCollection.message}
                </FormError>
              ) : null}
            </FormWrapper>
          </InputValues>
        </InfoBlock>
        <Divider />
        <InfoBlock>
          <Heading size="sm">Estoque</Heading>
          <InputValues flexDirection="row">
            <FormWrapper>
              <Text>Estoque minímo</Text>
              <TextInput
                type="number"
                placeholder="Digite o estoque minímo"
                {...register('stockMinimum')}
              />
            </FormWrapper>
            {errors.stockMinimum ? (
              <FormError as="span" size="sm">
                {errors.stockMinimum.message}
              </FormError>
            ) : null}
            <FormWrapper>
              <Text>Saldo em estoque</Text>
              <TextInput
                placeholder="Digite o saldo em estoque"
                type="number"
                {...register('stockAmount')}
              />
            </FormWrapper>
            {errors.stockAmount ? (
              <FormError as="span" size="sm">
                {errors.stockAmount.message}
              </FormError>
            ) : null}
          </InputValues>
        </InfoBlock>
        <Divider />
        <InfoBlock>
          <Heading size="sm">Preços</Heading>
          <InputValues flexDirection="row">
            <FormWrapper size="full">
              <Text>Preço de custo</Text>
              <TextInput
                prefix="R$"
                type="text"
                placeholder="Digite o preço de custo"
                suffixIconComponent={<Money />}
                {...register('priceWithoutProfit', {
                  onChange: handlePriceWithoutProfitChange,
                })}
              />
              {errors.priceWithoutProfit ? (
                <FormError as="span" size="sm">
                  {errors.priceWithoutProfit.message}
                </FormError>
              ) : null}
            </FormWrapper>
            <FormWrapper size="sm">
              <Text>Margem de lucro (%)</Text>
              <TextInput
                type="text"
                placeholder="Digite a margem de lucro em %"
                suffixIconComponent={<Percent />}
                {...register('profitPercentage', {
                  onChange: handleProfitPercentageChange,
                })}
              />
              {errors.profitPercentage ? (
                <FormError as="span" size="sm">
                  {errors.profitPercentage.message}
                </FormError>
              ) : null}
            </FormWrapper>
            <FormWrapper size="full">
              <Text>Preço de Varejo</Text>
              <TextInput
                prefix="R$"
                type="text"
                placeholder="Digite a preço de varejo"
                suffixIconComponent={<Money />}
                {...register('finalPrice', {
                  onChange: handleFinalPriceChange,
                })}
              />
              {errors.finalPrice ? (
                <FormError as="span" size="sm">
                  {errors.finalPrice.message}
                </FormError>
              ) : null}
            </FormWrapper>
          </InputValues>
        </InfoBlock>
        <Actions>
          <Button type="button" variant="secondary" onClick={() => reset()}>
            Limpar
          </Button>
          <Button type="submit" variant="primary">
            {isSubmitting ? 'Loading...' : 'Salvar'}
          </Button>
        </Actions>
      </form>
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
