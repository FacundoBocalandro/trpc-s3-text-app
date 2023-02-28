import {
  ActionIcon,
  Box,
  Button,
  FileButton,
  TextInput,
  Text,
} from '@mantine/core'
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
  const [tmpId, setTmpId] = useState<string>(`tmp-id-${crypto.randomUUID()}`)
  const [image, setImage] = useState<File | null>(null)
  const [loadingImages, setLoadingImages] = useState<string[]>([])

  const utils = api.useContext()
  const sendMessageMutation = api.msg.add.useMutation({
    onMutate: (input) => {
      /**
       * Optimistic updates: https://create.t3.gg/en/usage/trpc/#optimistic-updates
       */
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      utils.msg.list.cancel()

      // Get the data from the queryCache
      const prevData = utils.msg.list.getData()

      // Optimistically update the data with new message
      if (prevData) {
        if (input.hasImage) setLoadingImages([...loadingImages, tmpId])

        utils.msg.list.setData(undefined, [
          ...prevData,
          {
            id: tmpId,
            text: input.text,
            // set as null, since image won't be loaded
            imageKey: null,
            imageUrl: null,
            createdAt: new Date(),
          },
        ])
      }

      // Return the previous data so we can revert if something goes wrong
      return { prevData, tmpId }
    },
    onError: (_error, _variables, context) => {
      // If the mutation fails, use the context-value from onMutate
      if (context) {
        utils.msg.list.setData(undefined, context.prevData)
      }
    },
    // onSettled: (_data, _error, _variables, context) => {
    //   if (context) setLoadingImages(loadingImages.filter(id => id !== context.tmpId));
    // }
  })

  const sendMessageCallback = () => {
    setLoadingImages(loadingImages.filter((id) => id !== tmpId))
    setTmpId(`tmp-id-${crypto.randomUUID()}`)
    utils.msg.list.invalidate()
  }

  const _saveImage = (uploadUrl: RouterOutputs['msg']['add']) => {
    if (uploadUrl && image) {
      uploadFile(image, uploadUrl, () => sendMessageCallback())
      // reset image
      setImage(null)
    } else sendMessageCallback()
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

  const onEnter = onInputEnter(_sendMessage)

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
          <ChatMessage
            message={message}
            key={message.id}
            imageLoading={loadingImages.includes(message.id)}
          />
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
                position: 'relative',
              }}
            >
              {image && (
                <Text
                  sx={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    zIndex: 10,
                  }}
                >
                  1
                </Text>
              )}
              <IconPaperclip size={30} />
            </ActionIcon>
          )}
        </FileButton>
        <Button onClick={_sendMessage}>Send</Button>
      </Box>
    </Box>
  )
}

export default ChatRoom
