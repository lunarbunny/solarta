import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import Layout from '../components/Layout'
import "../styles/rhap.scss"

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}
const theme = extendTheme({ config })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </RecoilRoot>
  )
}
