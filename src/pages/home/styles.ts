import { Box, styled } from '@kawassaki-ui/react'

export const Container = styled(Box, {
  margin: '$8 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '$8',

  maxWidth: 1160,

  div: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '$4',
  },
})
