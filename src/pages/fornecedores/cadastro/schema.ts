import { ZodIssueCode, z } from 'zod'

export const registerSupplierFormPFSchema = z.object({
  name: z
    .string({ invalid_type_error: 'O nome é obrigatório!' })
    .min(1, 'O nome é obrigatório'),
  cpf: z
    .string({ invalid_type_error: 'O cpf é obrigatório!' })
    .transform((cpf, ctx) => {
      // CPF Regex
      if (!/\d{3}\.\d{3}\.\d{3}-\d{2}/g.test(cpf)) {
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: 'CPF inválido!',
        })
      }
      return cpf
    }),
  address: z.string().optional(),
})

export type RegisterSupplierFormPFProps = z.input<
  typeof registerSupplierFormPFSchema
>

export const registerSupplierFormPJSchema = z.object({
  legalName: z.string().min(1, 'A Razão Social é obrigatória!'),
  cnpj: z.string().transform((cnpj, ctx) => {
    // CNPJ Regex
    if (!/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g.test(cnpj)) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'CNPJ inválido!',
      })
    }
    return cnpj
  }),
  address: z.string().optional(),
})

export type RegisterSupplierFormPJProps = z.input<
  typeof registerSupplierFormPJSchema
>
