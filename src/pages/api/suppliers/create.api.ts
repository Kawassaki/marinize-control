import { prisma } from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export interface CreateSupplierProps {
  name?: string
  supplier_type?: string
  address?: string
  cnpj?: string
  cpf?: string
  legal_name?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method not allowed!',
    })
  }

  const { userId, supplier } = req.body

  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!userExists?.is_admin) {
    return res.status(403).json({
      message: 'Usuário não autorizado, contate o admin e tente novamente!',
    })
  }

  if (supplier.cnpj) {
    const supplierPJ = await prisma.supplier.findFirst({
      select: {
        cnpj: true,
      },
      where: {
        cnpj: supplier.cnpj,
      },
    })
    if (supplierPJ?.cnpj) {
      return res.status(403).json({
        message: 'Já existe um fornecedor com esse CNPJ!',
      })
    }
  }

  if (supplier.cpf) {
    const supplierPF = await prisma.supplier.findFirst({
      select: {
        cpf: true,
      },
      where: {
        cpf: supplier.cpf,
      },
    })
    if (supplierPF?.cpf) {
      return res.status(403).json({
        message: 'Já existe um fornecedor com esse CPF!',
      })
    }
  }

  await prisma.supplier.create({
    data: {
      name: supplier.name || null,
      supplier_type: supplier.supplier_type || null,
      address: supplier.address || null,
      cnpj: supplier.cnpj || null,
      cpf: supplier.cpf || null,
      legal_name: supplier.legal_name || null,
    },
  })

  return res.status(201).end()
}
