import { styled, Box } from '@kawassaki-ui/react'

export const Container = styled(Box, {
  margin: '$10 auto',
  maxWidth: 1160,
  padding: '$4',
  marginTop: '$6',
  display: 'flex',
  flexDirection: 'column',
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

export const Header = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$2',
  width: '100%',
})
