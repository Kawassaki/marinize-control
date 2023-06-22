import '../lib/dayjs'
import Header from '../components/header'
import { globalStyles } from '../styles/global'
import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Header />
        <Component {...pageProps} />
        <ToastContainer />
      </SessionProvider>
    </QueryClientProvider>
  )
}
