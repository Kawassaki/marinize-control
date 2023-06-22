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

  const suppliers = await prisma.supplier.findMany({
    select: {
      id: true,
      address: true,
      cpf: true,
      cnpj: true,
      legal_name: true,
      name: true,
      supplier_type: true,
    },
  })

  return res.status(200).json({ suppliers })
}
