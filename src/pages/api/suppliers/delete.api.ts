import { prisma } from '../../../lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      message: 'Method not allowed!',
    })
  }

  const userId = String(req.query.userId)
  const supplierId = String(req.query.supplierId)

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

  await prisma.supplier.delete({
    where: {
      id: supplierId,
    },
  })

  return res.status(200).end()
}
