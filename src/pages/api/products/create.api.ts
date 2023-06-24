import { prisma } from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export interface CreateProductProps {
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
  supplier_id: string
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

  const { userId, product } = req.body

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

  if (product.reference_code) {
    const productFound = await prisma.product.findFirst({
      select: {
        reference_code: true,
      },
      where: {
        reference_code: product.reference_code,
      },
    })
    if (productFound?.reference_code) {
      return res.status(403).json({
        message: 'Já existe um produto com esse codigo de referencia!',
      })
    }
  }

  await prisma.product.create({
    data: {
      barcode: product.barcode || null,
      date_collection: product.date_collection || null,
      final_price: product.final_price || null,
      name: product.name || null,
      price_without_profit: product.price_without_profit || null,
      profit_percentage: product.profit_percentage || null,
      reference_code: product.reference_code || null,
      season: product.season || null,
      size: product.size || null,
      stock_amount: product.stock_amount || null,
      stock_minimum: product.stock_minimum || null,
      supplier_id: product.supplier_id || null,
    },
  })

  return res.status(201).end()
}
