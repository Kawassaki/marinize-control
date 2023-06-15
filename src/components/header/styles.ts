import { styled } from '@kawassaki-ui/react'

export const Container = styled('header', {
  background: '$gray900',
  padding: '$10 0 $12',
})

export const Content = styled('div', {
  width: '100%',
  maxWidth: 1160,
  margin: '0 auto',
  padding: '0 $3',

  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
})

export const Actions = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$10',
  margin: '$4',

  '> a': {
    color: '$gray200',
    textDecoration: 'none',
    fontFamily: '$default',
    transition: 'color 0.2s ease-out',
    borderBottom: '2px solid transparent',

    '&:hover': {
      color: '$white',
      borderBottom: '2px solid $kawassakiMid',
    },
  },
})

export const UserInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$4',

  '> svg ': {
    color: '$white',
  },
})
