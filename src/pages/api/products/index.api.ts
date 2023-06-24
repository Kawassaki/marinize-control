import { prisma } from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      message: 'Method not allowed!',
    })
  }

  const userId = String(req.query.userId)

  if (!userId) {
    return res.status(404).json({
      message: 'User not filled!',
    })
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!userExists?.is_admin) {
    return res.status(403).json({
      message: 'User not authorized!',
    })
  }

  const products = await prisma.product.findMany({
    select: {
      id: true,
      barcode: true,
      date_collection: true,
      final_price: true,
      name: true,
      price_without_profit: true,
      profit_percentage: true,
      reference_code: true,
      season: true,
      size: true,
      stock_amount: true,
      stock_minimum: true,
      supplier: {
        select: {
          name: true,
        },
      },
    },
  })

  return res.status(200).json({ products })
}
