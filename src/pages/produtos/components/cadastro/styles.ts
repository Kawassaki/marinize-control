import { Box, Text, styled } from '@kawassaki-ui/react'

export const Container = styled(Box, {
  margin: '0 auto',
  maxWidth: 1160,
  padding: '$4',
  display: 'flex',
  flexDirection: 'column',
  border: 'none',
  gap: '$6',
  label: {
    p: {
      color: '$gray200',
    },
  },
})

export const RadioButtonArea = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '$4',
})

export const InfoBlock = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  alignItems: 'flex-start',
  justifyContent: 'baseline',
})

export const InputValues = styled('div', {
  display: 'flex',
  width: '100%',
  gap: '$4',

  input: {
    svg: {
      width: 23,
    },
  },
  'input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button':
    {
      margin: '0 $1',
      filter: 'invert(100%) brightness(60%);',
    },

  variants: {
    flexDirection: {
      row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
      },
      column: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
  },
  defaultVariants: {
    flexDirection: 'column',
  },
})

export const FormWrapper = styled('label', {
  width: '100%',
  variants: {
    size: {
      sm: {
        maxWidth: '14rem',
      },
      md: {
        maxWidth: '24rem',
      },
      lg: {
        maxWidth: '34rem',
      },
      full: {
        maxWidth: '100%',
      },
    },
  },
  defaultVariants: {
    size: 'full',
  },
})

export const FormError = styled(Text, {
  color: '$dangerLight',
})
