import { useEffect, useState } from 'react'
import { Text, TextInput, RadioButton, Button } from '@kawassaki-ui/react'

import {
  Actions,
  Container,
  FormError,
  FormWrapper,
  InfoBlock,
  InputValues,
  RadioButtonArea,
} from './styles'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { supplierType } from './index.types'
import {
  RegisterSupplierFormPFProps,
  RegisterSupplierFormPJProps,
  registerSupplierFormPFSchema,
  registerSupplierFormPJSchema,
} from './schema'
import { usePFCustomForm, usePJCustomForm } from './hooks/useCustomForm'
import { CreateSupplierProps } from '@/pages/api/suppliers/create.api'
import { api } from '@/lib/axios'
import { errorToast, successToast } from '@/components/toast'
import { AxiosError } from 'axios'
import { buildNextAuthOptions } from '@/pages/api/auth/[...nextauth].api'
import { getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next'
import { RegisterBack } from '@/components/registerBack'

export default function Cadastro() {
  const session = useSession()
  const router = useRouter()

  const [type, setType] = useState<string>(supplierType.PF)

  const { formStatePF, handleSubmitPF, registerPF, resetPF, setValuePF } =
    usePFCustomForm(registerSupplierFormPFSchema)

  const { formStatePJ, handleSubmitPJ, registerPJ, resetPJ, setValuePJ } =
    usePJCustomForm(registerSupplierFormPJSchema)

  async function handleSubmitSupplierForm(
    data: RegisterSupplierFormPFProps | RegisterSupplierFormPJProps,
  ) {
    const supplier: CreateSupplierProps = {}
    try {
      if (type === supplierType.PF) {
        const { cpf, name, address } = data as RegisterSupplierFormPFProps
        supplier.cpf = cpf
        supplier.name = name
        supplier.supplier_type = type
        supplier.address = address
        resetPF()
      } else {
        const { cnpj, legalName, address } = data as RegisterSupplierFormPJProps
        supplier.cnpj = cnpj
        supplier.legal_name = legalName
        supplier.supplier_type = type
        supplier.address = address
        resetPJ()
      }

      if (session.data?.user?.is_admin) {
        await api
          .post('/suppliers/create', {
            userId: session.data?.user?.id,
            supplier,
          })
          .then(async (item) => {
            if (item.status === 201) {
              successToast('Fornecedor criado com sucesso!')
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

  function handlePFChange() {
    setType(supplierType.PF)
  }

  function handlePJChange() {
    setType(supplierType.PJ)
  }

  async function handleBackAction() {
    await router.push('/fornecedores')
  }

  useEffect(() => {
    setValuePJ('legalName', '')
    setValuePF('name', '')
    setValuePF('cpf', '')
    setValuePJ('cnpj', '')
    setValuePF('address', '')
  }, [type, setValuePF, setValuePJ])

  return (
    <Container>
      <RegisterBack
        handleButtonClick={handleBackAction}
        title="Cadastro Fornecedor"
      />
      <RadioButtonArea>
        <RadioButton
          name="type"
          fieldName="Pessoa Física*"
          checked={type === supplierType.PF}
          onChange={handlePFChange}
        />
        <RadioButton
          name="type"
          fieldName="Pessoa Juridica*"
          checked={type === supplierType.PJ}
          onChange={handlePJChange}
        />
      </RadioButtonArea>
      {type === supplierType.PF ? (
        <form onSubmit={handleSubmitPF(handleSubmitSupplierForm)}>
          <InfoBlock>
            <InputValues flexDirection="column">
              <FormWrapper>
                <Text>Nome*</Text>
                <TextInput
                  placeholder="Digite o nome do fornecedor"
                  {...registerPF('name')}
                />
                {formStatePF.errors.name ? (
                  <FormError as="span" size="sm">
                    {formStatePF.errors.name.message}
                  </FormError>
                ) : null}
              </FormWrapper>
              <FormWrapper>
                <Text>CPF*</Text>
                <TextInput
                  mask="999.999.999-99"
                  placeholder="Digite o cpf do fornecedor"
                  {...registerPF('cpf')}
                />
                {formStatePF.errors.cpf ? (
                  <FormError as="span" size="sm">
                    {formStatePF.errors.cpf.message}
                  </FormError>
                ) : null}
              </FormWrapper>
              <FormWrapper>
                <Text>Endereço</Text>
                <TextInput
                  placeholder="Digite o endereço do fornecedor"
                  {...registerPF('address')}
                />
              </FormWrapper>
              {formStatePF.errors.address ? (
                <FormError as="span" size="sm">
                  {formStatePF.errors.address.message}
                </FormError>
              ) : null}
            </InputValues>
            <Text size="sm">*campos obrigatórios</Text>
          </InfoBlock>
          <Actions>
            <Button type="button" variant="secondary" onClick={() => resetPF()}>
              Limpar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!formStatePF.isValid || formStatePF.isSubmitting}
            >
              {formStatePF.isSubmitting ? 'Loading...' : 'Salvar'}
            </Button>
          </Actions>
        </form>
      ) : type === supplierType.PJ ? (
        <form onSubmit={handleSubmitPJ(handleSubmitSupplierForm)}>
          <InfoBlock>
            <InputValues flexDirection="column">
              <FormWrapper>
                <Text>Razão Social*</Text>
                <TextInput
                  placeholder="Digite a razão social do fornecedor"
                  {...registerPJ('legalName')}
                />
                {formStatePJ.errors.legalName ? (
                  <FormError as="span" size="sm">
                    {formStatePJ.errors.legalName?.message}
                  </FormError>
                ) : null}
              </FormWrapper>
              <FormWrapper>
                <Text>CNPJ*</Text>
                <TextInput
                  placeholder="Digite o CNPJ do fornecedor"
                  mask="99.999.999/9999-99"
                  {...registerPJ('cnpj')}
                />
                {formStatePJ.errors.cnpj ? (
                  <FormError as="span" size="sm">
                    {formStatePJ.errors.cnpj?.message}
                  </FormError>
                ) : null}
              </FormWrapper>

              <FormWrapper>
                <Text>Endereço</Text>
                <TextInput
                  placeholder="Digite o endereço do fornecedor"
                  {...registerPJ('address')}
                />
              </FormWrapper>
              {formStatePJ.errors.address ? (
                <FormError as="span" size="sm">
                  {formStatePJ.errors.address.message}
                </FormError>
              ) : null}
            </InputValues>
            <Text size="sm">*campos obrigatórios</Text>
          </InfoBlock>
          <Actions>
            <Button type="button" variant="secondary" onClick={() => resetPJ()}>
              Limpar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!formStatePJ.isValid || formStatePJ.isSubmitting}
            >
              {formStatePJ.isSubmitting ? 'Loading...' : 'Salvar'}
            </Button>
          </Actions>
        </form>
      ) : null}
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
