import { styled } from '@kawassaki-ui/react'

export const CustomTd = styled('td', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$2',

  'button:nth-of-type(1)': {
    backgroundColor: '$dangerBase',
    transition: 'filter .2s ease-in-out',
    '&:hover': {
      backgroundColor: '$dangerLight',
    },
  },
  'button:nth-of-type(2)': {
    backgroundColor: '$successBase',
    transition: 'filter .2s ease-in-out',
    '&:hover': {
      backgroundColor: '$successLight',
    },
  },
})
