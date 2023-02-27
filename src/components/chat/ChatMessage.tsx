import {api, RouterOutputs} from "~/utils/api";
import {FC} from "react";
import {Box, Text, Image, ActionIcon} from "@mantine/core";
import {useHover} from "@mantine/hooks";
import {IconTrash} from "@tabler/icons-react";

type Props = {
    message: RouterOutputs['msg']['list'][0]
}

const ChatMessage: FC<Props> = ({message}) => {
    const utils = api.useContext();

    const {hovered, ref} = useHover();
    const deleteMessageMutation = api.msg.delete.useMutation({
        onMutate: (input) => {
            utils.msg.list.cancel();
            const prevMessages = utils.msg.list.getData();
            /**
             * Read https://stackoverflow.com/questions/74679725/trpc-throws-an-error-in-setdata-usecontext-wrapper-of-tanstack-query-after-i-u
             */
            if (prevMessages) utils.msg.list.setData((() => {})(), prevMessages.filter(message => message.id !== input.id));
        }
    });

    return (
        <Box sx={{
            width: '50%',
            position: 'relative'
        }} ref={ref}>
            {hovered && <ActionIcon sx={{
                position: 'absolute',
                top: -10,
                right: -10,
            }} onClick={() => deleteMessageMutation.mutate({id: message.id, imageKey: message.imageKey})}>
                <IconTrash size={30}/>
            </ActionIcon>}
            <Box sx={{
                backgroundColor: '#fff',
                width: '100%',
                padding: 10
            }}>
                <Text fz="md">{message.text}</Text>
                {message.imageUrl && <Image
                    radius="md"
                    width={200}
                    height={200}
                    src={message.imageUrl}
                />}
            </Box>
            <Text fz="xs">{message.createdAt.toLocaleString()}</Text>
        </Box>
    )
}

export default ChatMessage;
