import { Modal, styled } from '@kawassaki-ui/react'

export const Actions = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  width: '100%',

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

export const TrStyled = styled('tr', {})

export const TdStyled = styled('td', {
  color: '$white',
  padding: '$2',

  variants: {
    empty: {
      true: {
        color: '$white',
      },
      false: {
        color: '$gray400',
      },
    },
  },
})

export const ModalContent = styled('div', {
  margin: 'auto',
})

export const CustomModal = styled(Modal, {
  margin: 0,
  div: {
    height: '$60',
  },
})
