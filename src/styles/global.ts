import { globalCss } from '@kawassaki-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$gray700',
    color: '$kawassakiMid',
    '-webkit-font-smoothing': 'antialiased',
  },
})
