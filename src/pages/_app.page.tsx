import '../lib/dayjs'
import Header from '../components/header'
import { globalStyles } from '../styles/global'
import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  )
}
