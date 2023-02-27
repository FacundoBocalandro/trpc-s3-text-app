import { MantineProvider } from '@mantine/core'
import type { AppType } from 'next/app'
import { api } from '~/utils/api'
import '~/styles/index.css'

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: 'light',
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  )
}

export default api.withTRPC(MyApp)
