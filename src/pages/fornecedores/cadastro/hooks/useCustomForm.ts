import { zodResolver } from '@hookform/resolvers/zod'
import {
  RegisterSupplierFormPFProps,
  RegisterSupplierFormPJProps,
} from '../schema'
import { ZodType } from 'zod'
import { useForm } from 'react-hook-form'

export const usePFCustomForm = (
  schema: ZodType<RegisterSupplierFormPFProps>,
) => {
  const { register, handleSubmit, formState, watch, reset, setValue } =
    useForm<RegisterSupplierFormPFProps>({
      resolver: zodResolver(schema),
      shouldFocusError: true,
    })

  return {
    registerPF: register,
    handleSubmitPF: handleSubmit,
    formStatePF: formState,
    watchPF: watch,
    resetPF: reset,
    setValuePF: setValue,
  }
}

export const usePJCustomForm = (
  schema: ZodType<RegisterSupplierFormPJProps>,
) => {
  console.log()

  const { register, handleSubmit, formState, watch, reset, setValue } =
    useForm<RegisterSupplierFormPJProps>({
      resolver: zodResolver(schema),
      shouldFocusError: true,
    })

  return {
    registerPJ: register,
    handleSubmitPJ: handleSubmit,
    formStatePJ: formState,
    watchPJ: watch,
    resetPJ: reset,
    setValuePJ: setValue,
  }
}
