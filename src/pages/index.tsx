import { api } from '~/utils/api'
import { Box } from '@mantine/core'
import ChatRoom from '~/components/chat/ChatRoom'

export default function IndexPage() {
  const messages = api.msg.list.useQuery()

  if (!messages.data) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>Loading...</h1>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px 0 10px 0',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: '50%',
        }}
      >
        <ChatRoom messages={messages.data} />
      </Box>
    </Box>
  )
}
