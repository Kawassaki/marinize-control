import { Box, styled } from '@kawassaki-ui/react'

export const Container = styled(Box, {
  margin: '0 auto',
  maxWidth: 1160,
  padding: '$4',
  display: 'flex',
  flexDirection: 'column',
  border: 'none',
  gap: '$4',
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',

    p: {
      color: '$gray200',
    },
  },
})
