import { api, RouterOutputs } from '~/utils/api'
import { FC } from 'react'
import { Box, Text, Image, ActionIcon, Loader } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import { IconTrash } from '@tabler/icons-react'

type Props = {
  message: RouterOutputs['msg']['list'][0]
  imageLoading: boolean
}

const ChatMessage: FC<Props> = ({ message, imageLoading }) => {
  const utils = api.useContext()

  const { hovered, ref } = useHover()
  const deleteMessageMutation = api.msg.delete.useMutation({
    onMutate: (input) => {
      /**
       * Optimistic updates: https://create.t3.gg/en/usage/trpc/#optimistic-updates
       */
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      utils.msg.list.cancel()

      // Get the data from the queryCache
      const prevData = utils.msg.list.getData()

      // Optimistically update the data with message deleted
      if (prevData) {
        utils.msg.list.setData(
          undefined,
          prevData.filter((message) => message.id !== input.id)
        )
      }

      // Return the previous data so we can revert if something goes wrong
      return { prevData }
    },
    onError: (_error, _variables, context) => {
      // If the mutation fails, use the context-value from onMutate
      if (context) {
        utils.msg.list.setData(undefined, context.prevData)
      }
    },
  })

  return (
    <Box
      sx={{
        width: '50%',
        position: 'relative',
      }}
      ref={ref}
    >
      {hovered && (
        <ActionIcon
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
          }}
          onClick={() =>
            deleteMessageMutation.mutate({
              id: message.id,
              imageKey: message.imageKey,
            })
          }
        >
          <IconTrash size={30} />
        </ActionIcon>
      )}
      <Box
        sx={{
          backgroundColor: '#fff',
          width: '100%',
          padding: 10,
        }}
      >
        <Text fz="md">{message.text}</Text>
        {imageLoading ? (
          <Loader />
        ) : (
          message.imageUrl && (
            <Image
              radius="md"
              width={200}
              height={200}
              alt={message.text}
              src={message.imageUrl}
            />
          )
        )}
      </Box>
      <Text fz="xs">{message.createdAt.toLocaleString()}</Text>
    </Box>
  )
}

export default ChatMessage
