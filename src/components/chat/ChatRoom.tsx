import { ActionIcon, Box, Button, FileButton, TextInput, Text } from '@mantine/core'
import { IconPaperclip } from '@tabler/icons-react'
import { FC, useState } from 'react'
import { api, RouterOutputs } from '~/utils/api'
import ChatMessage from '~/components/chat/ChatMessage'
import { getFileExtension, uploadFile } from '~/utils/image'
import { onInputEnter } from '~/utils/input'

type Props = {
  messages: RouterOutputs['msg']['list']
}

const ChatRoom: FC<Props> = ({ messages }) => {
  const [message, setMessage] = useState<string>('')
  const [image, setImage] = useState<File | null>(null);

  const utils = api.useContext()
  const sendMessageMutation = api.msg.add.useMutation()

  const sendMessageCallback = (data: RouterOutputs['msg']['add']) => {
    // reset image
    setImage(null);

    utils.msg.list.cancel()
    const prevMessages = utils.msg.list.getData()
    /**
     * Read https://stackoverflow.com/questions/74679725/trpc-throws-an-error-in-setdata-usecontext-wrapper-of-tanstack-query-after-i-u
     */
    if (prevMessages)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      utils.msg.list.setData((() => {})(), [...prevMessages, data.message])
  }

  const _saveImage = (data: RouterOutputs['msg']['add']) => {
    if (data.uploadUrl && image) {
      uploadFile(image, data.uploadUrl, () => sendMessageCallback(data))
    } else sendMessageCallback(data)
  }

  const _sendMessage = () => {
    if (!!message) {
      // reset message
      setMessage('')
      sendMessageMutation
        .mutateAsync({
          text: message,
          hasImage: Boolean(image),
          imageExtension: getFileExtension(image),
        })
        .then(_saveImage)
    }
  }

  const onEnter = onInputEnter(_sendMessage);

  return (
    <Box
      sx={(theme) => ({
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.colors.gray[5],
      })}
    >
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[3],
          flexGrow: 1,
          padding: 20,
          overflowY: 'scroll',
        })}
      >
        {messages.map((message) => (
          <ChatMessage message={message} key={message.id} />
        ))}
      </Box>
      <Box
        sx={(theme) => ({
          height: 100,
          width: '100%',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: theme.colors.gray[5],
          display: 'flex',
          alignItems: 'center',
          padding: 10,
        })}
      >
        <TextInput
          placeholder="Enter message..."
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
          autoComplete="nope"
          sx={{
            flexGrow: 1,
          }}
          onKeyPress={onEnter}
        />
        <FileButton onChange={setImage} accept="image/png,image/jpeg">
          {(props) => (
            <ActionIcon
              {...props}
              sx={{
                margin: 20,
                position: 'relative'
              }}
            >
              {image && <Text sx={{
                position: 'absolute',
                top: -5,
                right: -5,
                zIndex: 10,
              }}>1</Text>}
              <IconPaperclip size={30}/>
            </ActionIcon>
          )}
        </FileButton>
        <Button onClick={_sendMessage}>Send</Button>
      </Box>
    </Box>
  )
}

export default ChatRoom
