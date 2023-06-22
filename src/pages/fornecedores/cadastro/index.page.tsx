import { ChangeEvent, useEffect, useState } from 'react'
import {
  Text,
  TextInput,
  Heading,
  RadioButton,
  Button,
  IconButton,
} from '@kawassaki-ui/react'

import {
  Actions,
  Container,
  FormError,
  FormWrapper,
  InfoBlock,
  InputValues,
  RadioButtonArea,
  Header,
} from './styles'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'phosphor-react'
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
          .then((item) => {
            if (item.status === 201) {
              successToast('Fornecedor criado com sucesso!')
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

  function handlePFChange(e: ChangeEvent) {
    setType(supplierType.PF)
  }

  function handlePJChange(e: ChangeEvent) {
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
      <Header>
        <IconButton
          type="button"
          size="sm"
          icon={<ArrowLeft />}
          onClick={handleBackAction}
        />
        <Heading>Fornecedores</Heading>
      </Header>
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
