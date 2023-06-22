import { styled } from '@kawassaki-ui/react'
import Link from 'next/link'

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
    textDecoration: 'none',
    fontFamily: '$default',
    transition: 'color 0.2s ease-out',

    '&:hover': {
      color: '$white',
      borderBottom: '2px solid $kawassakiMid',
    },
  },
})

export const CustomLink = styled(Link, {
  variants: {
    urlActive: {
      true: {
        color: '$white',
        borderBottom: '2px solid $kawassakiMid',
      },
      false: {
        color: '$gray200',
        borderBottom: '2px solid transparent',
      },
    },
  },
  defaultVariants: {
    urlActive: false,
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
